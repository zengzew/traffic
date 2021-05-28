export default{
    path: '/tableData',
    data: {
        head: [
            // {
            //     key: 'name',
            //     name: '车牌号'
            // },
            {
                key: 'sex',
                name: '车辆类别'
            },
            {
                key: 'age',
                name: '车辆状态'
            },
            {
                key: 'address',
                name: '轨迹里程(m)'
            },
            {
                key: 'email',
                name: '轨迹条数'
            },
            {
                key: 'remark',
                name: '开始时间'
            },
            {
                key: 'remark',
                name: '结束时间'
            },
            {
                key: 'remark',
                name: '操作'
            }
        ],
        body: [
            {
                'name': '警车',
                'sex|1': ["男", "女"],
                'age': '@natural(18, 60)',
                'address': '@city(true) ',
                'email': '@email()',
                'remark': '@cparagraph(1)',
                operation: 'edit,delete'
            },
            {
                'name': '铁骑',
                'sex|1': ["男", "女"],
                'age': '@natural(18, 60)',
                'address': '@city(true)',
                'email': '@email()',
                'remark': '@cparagraph(1)',
                operation: 'edit,delete'
            },
        ]
    }
}