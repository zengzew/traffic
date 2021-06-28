<template>
    <div class="aipp-select">
        <div class="aipp-select-item" @click="$router.push('/home')" :style="{height:height + 'px', width:height + 'px'}">
            <div class="diamond"></div>
            <span class="platName">重点车辆轨迹管理</span>
        </div>
        <div class="aipp-select-item" @click="$router.push('/dangerAnalyze')" :style="{height:height + 'px', width:height + 'px'}">
            <div class="diamond"></div>
            <span class="platName">交通安全分析</span>
        </div>
    </div>
</template>

<script>
export default {
    data(){
      return{
        height:200
      }
    },
    methods: {
        getHeight() {
          this.height  = window.innerHeight * 0.4
        },
    },
    mounted() {
        setTimeout(() => {
            this.getHeight();
        }, 300);
        window.addEventListener("resize", this.getHeight);
    },
};
</script>

<style scoped>
.aipp-select {
    width: 100%;
    height: 100%;
    background: url(~@/assets/images/aiCalPlatform/select.png);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.diamond {
    width: 200px;
    height: 200px;
    background: #2d5d81;
    transform: rotate(45deg);
    cursor: pointer;
    transition: 0.4s;
}

.aipp-select-item:hover {
    cursor: pointer;
}

.aipp-select-item:hover .diamond {
    box-shadow: 10px 5px 5px black;
}

.aipp-select-item:hover .platName {
    text-shadow: 1px 1px 1px black;
}

.platName {
    color: #2d5d81;
    font-weight: 900;
    font-size: 2rem;
    line-height: 300px;
    transition: 0.4s;
    cursor: pointer;
}
</style>
