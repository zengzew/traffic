<template>
    <div class="contentBox">
        401:没有操作权限
        <a @click="back">返回上一页</a>
    </div>
</template>

<script>
export default {
    methods: {
        back(){
            this.$router.go(-1)
        }
    }
}
</script>
<style scoped lang="scss">
    .contentBox {
        position: absolute;
        font-size: 20px;
        height: 100%;
        margin-left: 50%;
        margin-top: 50%;
        transform: translate(-50%, -50%);
        color: black;
        a {
            cursor: pointer;
        }
    }
</style>