<template>
    <transition name="slide-right">
        <div class="content" :class="{'default': defaultTheme === 0,
                                        'eye': defaultTheme === 1,
                                       'night': defaultTheme === 2,
                                       'gold': defaultTheme === 3}">
            <div class="content-wrapper" v-if="bookAvailable">
                <div class="content-item" v-for="(item, index) in navigation.toc" :key="index" @click="jumpTo(item.href)">
                    <span class="text">{{item.label}}</span>
                </div>
            </div>
            <div class="empty" v-else>加载中...</div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            ifShowContent: Boolean,
            navigation: Object,
            bookAvailable: Boolean,
            defaultTheme: Number
        },
        methods: {
            jumpTo(target) {
                this.$emit('jumpTo', target)
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../assets/styles/global";
    .default {
        background-color: #fff;
    }
    .eye {
        background-color: #ceeaba;
    }
    .night {
        background-color: #404040;
    }
    .gold {
        background-color: rgb(241,236,226);
    }
    .content {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 103;
        width: 80%;
        height: 100%;
        .content-wrapper {
            width: 100%;
            height: 100%;
            overflow: auto;
            .content-item {
                padding: px2rem(20) px2rem(15);
                border-bottom: px2rem(1) solid #f4f4f4;
                .text {
                    font-size: px2rem(14);
                    color: #333;
                }
            }
        }
        .empty {
            width: 100%;
            height: 100%;
            @include center;
            font-size: px2rem(16);
            color: #333;
        }
    }
</style>