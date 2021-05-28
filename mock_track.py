# -*- coding: UTF-8 -*-

import requests
import random
import json
import time
import threading
from geopy.distance import geodesic

# 需要mock哪个key的设备
API_KEY = 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ'

# 需要mock哪个service下的设备
SERVICE_ID = 'd41ef73b7e3d4fc2b23f24709ca2c77e'

# 指定哪些设备行驶，未指定则选取所有离线设备（不超过MAX_DEVICE_COUNT规定个数）
# DEVICE_IDS = ['55641f00d39a4afe88b442451ed7cba4']
DEVICE_IDS = []

# 小车矩形围栏，小车会在这个矩形里随机选取路线行驶
# [min_lng, min_lat, max_lng, max_lat]
#DEVICE_FENCE = [103.99912, 30.614482, 104.125463, 30.715775]
#DEVICE_FENCE = [103.99912, 30.614482, 104.125463, 30.715775]
DEVICE_FENCE = [117.170097,38.970722,117.2636,39.01321]

# 备选线路条数
ROUTE_POOL_SIZE = 10

# 小车最小和最大速度（米/秒）
DEVICE_MIN_SPEED = 10
DEVICE_MAX_SPEED = 10

# 轨迹上报间隔（秒）
UPLOAD_FREQ = 1

# 最大允许同时行驶的小车数量
MAX_DEVICE_COUNT = 1

# 每个小车跑多少条轨迹后停止（-1表示永不停止）
TRACK_COUNT = 1

# 小车定位噪声标准差（度）
NOISE_SIGMA = 5e-5

# 轨迹实时服务地址
TRACK_REALTIME_HOST = 'http://82.156.230.142:10901'

# 轨迹上传服务地址
TRACK_UPLOAD_HOST = 'http://82.156.230.142:10900'

# webservice服务地址
WEBSERVICE_HOST = 'http://49.232.95.234:10602'

# 路线池
route_pool = []


# 获取离线设备id集合
def get_offline_device_ids():
    r = requests.get(
        TRACK_REALTIME_HOST + '/track/v1/device/list?key=' + API_KEY + '&serviceid=' + SERVICE_ID + '&online=0&pagesize=100')
    if r.status_code != 200:
        log('[get_device_ids] bad status code: ' + str(r.status_code))
        return
    resp = r.json()
    if resp['status'] != 0:
        log('[get_device_ids] bad status: ' + str(resp['status']) + '(' + resp['message'] + ')')
        return
    return list(map(lambda o: o['deviceid'], resp['result']))


# 创建一条轨迹
def add_track(device_id):
    post_data = {
        'key': API_KEY,
        'serviceid': SERVICE_ID,
        'deviceid': device_id
    }
    r = requests.post(TRACK_REALTIME_HOST + '/track/v1/track/add', data=json.dumps(post_data))
    if r.status_code != 200:
        log('[add_track] bad status code: ' + str(r.status_code))
        return
    resp = r.json()
    if resp['status'] != 0:
        log('[add_track] bad status: ' + str(resp['status']) + '(' + resp['message'] + ')')
        return
    return resp['result']['trackid']


# 在框选矩形内获取一条随机路线
def get_random_route(min_lng, min_lat, max_lng, max_lat):
    rand_from_lng = min_lng + random.random() * (max_lng - min_lng)
    rand_from_lat = min_lat + random.random() * (max_lat - min_lat)
    rand_to_lng = min_lng + random.random() * (max_lng - min_lng)
    rand_to_lat = min_lat + random.random() * (max_lat - min_lat)

    r = requests.get('{}/ws/direction/v1/driving?from={:f},{:f}&to={:f},{:f}'.
                     format(WEBSERVICE_HOST, rand_from_lat, rand_from_lng, rand_to_lat, rand_to_lng))
    if r.status_code != 200:
        log('[get_random_route] bad status code: ' + str(r.status_code))
        return
    resp = r.json()
    if resp['status'] != 0:
        log('[get_random_route] bad status: ' + str(resp['status']) + '(' + resp['message'] + ')')
        return
    routes = resp['result']['routes']
    if not routes or len(routes) == 0:
        log('[get_random_route] no routes')
        return

    route = routes[0]['polyline']
    # 解压坐标
    for i in range(2, len(route)):
        route[i] = route[i - 2] + route[i] / 1e6
    polyline = []
    for i in range(1, len(route), 2):
        polyline.append({'lng': route[i], 'lat': route[i - 1]})
    return polyline


# 给经纬度加上一定的噪音
def add_noise(loc):
    if NOISE_SIGMA != 0:
        loc['lng'] += random.normalvariate(0, NOISE_SIGMA)
        loc['lat'] += random.normalvariate(0, NOISE_SIGMA)
    return loc


# 把算路得到的route转换成轨迹上报点
def route_to_track_points(polyline):
    points = []
    temp_interval = 0.0

    step = (DEVICE_MIN_SPEED + random.random() * (DEVICE_MAX_SPEED - DEVICE_MIN_SPEED)) * UPLOAD_FREQ
    for i in range(1, len(polyline)):
        lng, lat = polyline[i]['lng'], polyline[i]['lat']
        prev_lng, prev_lat = polyline[i - 1]['lng'], polyline[i - 1]['lat']
        dis = geodesic((prev_lat, prev_lng), (lat, lng)).m
        if step >= dis:
            step -= dis
            continue
        lng_step = step * (lng - prev_lng) / dis
        lat_step = step * (lat - prev_lat) / dis
        while dis > step:
            points.append(add_noise({'lng': prev_lng, 'lat': prev_lat, 'speed': step/UPLOAD_FREQ}))
            prev_lng, prev_lat = prev_lng + lng_step, prev_lat + lat_step
            dis -= step
            step = (DEVICE_MIN_SPEED + random.random() * (DEVICE_MAX_SPEED - DEVICE_MIN_SPEED)) * UPLOAD_FREQ
    points.append(add_noise({'lng': polyline[len(polyline)-1]['lng'], 'lat': polyline[len(polyline)-1]['lat'], 'speed': 0}))

    return points


# 上报一个轨迹点
def upload_one_point(device_id, track_id, lng, lat, speed):
    loc_time = int(round(time.time()*1000))
    post_data = {
        'key': API_KEY,
        'serviceid': SERVICE_ID,
        'deviceid': device_id,
        'trackid': track_id,
        'points': [{
            'loctime': loc_time,
            'lng': lng,
            'lat': lat,
            'altitude': 0,
            'radius': 0,
            'speed': speed,
            'bearing': random.random() * 180
        }]
    }
    r = requests.post(TRACK_UPLOAD_HOST + '/track/v1/point/upload', data=json.dumps(post_data))
    if r.status_code != 200:
        log('[upload_one_point] bad status code: ' + str(r.status_code))
        return
    resp = r.json()
    if resp['status'] != 0:
        log('[upload_one_point] bad status: ' + str(resp['status']) + '(' + resp['message'] + ')')
    return


# 关闭一条轨迹
def close_track(device_id, track_id):
    post_data = {
        'key': API_KEY,
        'serviceid': SERVICE_ID,
        'deviceid': device_id,
        'trackid': track_id
    }
    r = requests.post(TRACK_REALTIME_HOST + '/track/v1/track/close', data=json.dumps(post_data))
    if r.status_code != 200:
        log('[close_track] bad status code: ' + str(r.status_code))
        return
    resp = r.json()
    if resp['status'] != 0:
        log('[close_track] bad status: ' + str(resp['status']) + '(' + resp['message'] + ')')
    return


# 模拟小车移动
def mock_track(device_id):
    count = 0
    while TRACK_COUNT < 0 or count < TRACK_COUNT:
        time.sleep(1)
        count += 1

        # 创建轨迹
        track_id = add_track(device_id)
        if not track_id:
            log('device({}) add track fail'.format(device_id))
            continue
        log('device({}) add track: {}'.format(device_id, track_id))

        # 在路线池内随机获取一条随机路线
        points = random.choice(route_pool)

        # 定时上报一个轨迹点
        log('device({}) track({}) uploading points, eta: {:d}s'.format(device_id, track_id, len(points)))
        for point in points:
            upload_one_point(device_id, track_id, point['lng'], point['lat'], point['speed'])
            time.sleep(UPLOAD_FREQ)

        # 关闭轨迹
        close_track(device_id, track_id)
        log('device({}) track({}) closed'.format(device_id, track_id))


# 初始化路线池
def init_route_pool():
    print('[init_route_pool] init running...')
    while len(route_pool) < ROUTE_POOL_SIZE:
        time.sleep(0.2)
        # 在框选范围内获取一条随机路线
        polyline = get_random_route(DEVICE_FENCE[0], DEVICE_FENCE[1], DEVICE_FENCE[2], DEVICE_FENCE[3])
        if not polyline or len(polyline) < 2:
            continue

        # 把算路得到的route转换成轨迹上报点
        points = route_to_track_points(polyline)
        route_pool.append(points)
        print('[init_route_pool] add new route, size now: ' + str(len(route_pool)))


# 日志
def log(content):
    print('{} | {}'.format(time.strftime('%Y-%m-%d %H:%M:%S'), content))


if __name__ == '__main__':
    # 获取离线设备
    ids = DEVICE_IDS
    if len(ids) == 0:
        ids = get_offline_device_ids()
        if not ids or len(ids) == 0:
            log('[main] no runnable device found')
            exit(1)
        if len(ids) > MAX_DEVICE_COUNT:
            ids = ids[:MAX_DEVICE_COUNT]

    # 初始化路线池
    init_route_pool()

    # 启动小车线程
    threads = []
    for _id in ids:
        t = threading.Thread(target=mock_track, args=(_id,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()
