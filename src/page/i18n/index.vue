<template>
    <div class="sys-page">
        <app-title title="国际化插件"></app-title>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'i18n',
    data() {
        return {}
    },
    computed: {
        ...mapState({
            lang: state => state.lang
        })
    },
    methods: {
        ...mapMutations({
            toggleLang: 'changeLang'
        }),
        changeLang(val) {
            if (val == this.lang) return
            this.toggleLang(val)
        }
    }
}
</script>