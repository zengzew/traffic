<template>
    <div class="sys-table">
        <slot></slot>
        <div class="sys-table-pagination">
            <template v-if="pagination">
                <el-pagination 
                    :layout="pageLayout"
                    :total="this.tableCount"
                    :page-size="this.pagesize"
                    @size-change="sizeChange"
                    :current-page="pageindex"
                    @current-change="pageChange"
                    :class="align"
                   >
                </el-pagination>
            </template>
            <template v-else>
                <slot name="pagination"></slot>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    name: 'TableMixin',
    props: {
        pagination: Boolean,
        paginationAlign: String,
        s:  {
            type: Number,
            default: function () {
                return 10
            }
        },
        paginationTotal: {
            type: Number,
            default: function () {
                return 10
            }
        },
        sizeChange: {
            type: Function,
            default: function(){
                return null
            }
        },
        // pageChange: {
        //     type: Function,
        //     default: function(){
        //         return null
        //     }
        // },
        pageLayout: {
            default: function (){
                return 'total,  prev, pager, next, jumper'
                // return 'total, sizes, prev, pager, next, jumper'
            }
        }
    },
    computed: {
        ...mapState({
            tableList: state => state.tableData.tableList,
            tableCount: state => state.tableData.tableCount,
            pagesize: state => state.tableData.pagesize,
            pageindex: state => state.tableData.pageindex,
        }),
        align(){
            let res;
            switch(this.paginationAlign){
                case 'right': 
                    res = 'textR'
                    break
                case 'center': 
                    res = 'textC'
                    break
                default:
                    res = ''
            }
            return res
        }
    },
    methods: {
        pageChange(val) {
            this.$store.dispatch('tableData/getPageindex', val)
        }
    }
}
</script>
<style lang="scss" scoped>
    .sys-table {
        padding: 0 40px;
        padding-bottom: 40px
    }
</style>
