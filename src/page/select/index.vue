<template>
    <div class="aipp-select">
        <!-- <div class="aipp-select-item" @click="$router.push('/home')" >
            <div class="diamond" :style="{height:height + 'px', width:height + 'px'}"></div>
            <span class="platName">重点车辆轨迹管理</span>
        </div> -->
        <div class="aipp-select-item" @click="$router.push('/dangerAnalyze')" >
            <div class="diamond" :style="{height:height + 'px', width:height + 'px'}"></div>
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
    created(){
    },
    methods: {
        getHeight() {
          this.height  = window.innerHeight * 0.2
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
    /* background: url(~@/assets/images/aiCalPlatform/select.png); */
    background: url(../../assets/images/aiCalPlatform/select.png);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    min-height: 600px;
    background-size:100% 100%;
}

.aipp-select-item{
    transform: translateX(20%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.diamond {
    width: 200px;
    height: 200px;
    background:#0b0d168c;
    cursor: pointer;
    transition: 0.4s;
    transform:rotate(45deg);
    border: #fff 1px solid;
}

.aipp-select-item:hover {
    cursor: pointer;
}

.aipp-select-item:hover .diamond {
    box-shadow: 10px 5px 5px rgba(255, 255, 255, 0.486);
    border-block-color: rgb(133, 129, 129);
    background-color: #0b0d16c2;
}

.aipp-select-item:hover .platName {
    text-shadow: 1px 1px 1px #fff;
}

.platName {
    margin-top: 20%;
    display: inline-block;
    color: #fff;
    font-weight: 900;
    font-size: 2rem;
    transition: 0.4s;
    cursor: pointer;
    text-align:center;
}
</style>
