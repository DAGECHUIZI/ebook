<template>
    <div class="ebook">
        <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
        <div class="read-wrapper">
            <div id="read"></div>
            <div class="mask">
                <div class="left" @click="prevPage"></div>
                <div class="center" @click="toggleTitleAndMenu"></div>
                <div class="right" @click="nextPage"></div>
            </div>
        </div>
        <menu-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"
                  :fontSizeList="fontSizeList"
                  :defaultFontSize="defaultFontSize"
                  @setFontSize="setFontSize"
                  :defaultTheme="defaultTheme"
                  :themeList="themeList"
                  @setTheme="setTheme"
                  :bookAvailable="bookAvailable"
                  @onProgressChange="onProgressChange"
                  @jumpTo="jumpTo"
                  :navigation="navigation"
                  :parentProgress="progress"
                  ref="menuBar"></menu-bar>
    </div>
</template>

<script>
    import TitleBar from './components/TitleBar';
    import MenuBar from './components/MenuBar';
    import Epub from 'epubjs';
    const DOWNLOAD_URL='/static/2018_Book_AgileProcessesInSoftwareEngine.epub';
    global.ePub=Epub;
    export default {
        components: {
            TitleBar,
            MenuBar
        },
        data() {
            return {
                ifTitleAndMenuShow: false,
                fontSizeList: [
                    {fontSize:12},
                    {fontSize:14},
                    {fontSize:16},
                    {fontSize:18},
                    {fontSize:20},
                    {fontSize:22},
                    {fontSize:24}
                ],
                defaultFontSize: 16,
                defaultTheme: 0,
                themeList:[
                    {
                        name: 'default',
                        style: {
                            body: {
                                'color': '#000', 'background': '#fff'
                            }
                        }
                    },
                    {
                        name: 'eye',
                        style: {
                            body: {
                                'color': '#000', 'background': '#ceeaba'
                            }
                        }
                    },
                    {
                        name: 'night',
                        style: {
                            body: {
                                'color': '#fff', 'background': '#000'
                            }
                        }
                    },
                    {
                        name: 'gold',
                        style: {
                            body: {
                                'color': '#000', 'background': 'rgb(241,236,226)'
                            }
                        }
                    },
                ],
                bookAvailable: false,
                navigation: {},
                progress: 0
            }
        },
        methods: {
            // 电子书的渲染和解析
            showEpub() {
                //生成电子书
                this.book= new Epub(DOWNLOAD_URL);
                //
                this.rendition=this.book.renderTo('read',{
                    width:window.innerWidth,
                    height:window.innerHeight,
                    // 兼容iOS
                    method: 'default'
                });
                //
                this.rendition.display();
                //
                this.themes=this.rendition.themes;
                //设置默认字体
                this.themes.fontSize(this.defaultFontSize);
                //
                this.registerTheme();
                this.themes.select(this.defaultTheme);
                //
                this.book.ready.then(() => {
                    this.navigation = this.book.navigation;
                    return this.book.locations.generate()
                }).then(result => {
                    this.locations = this.book.locations;
                    this.bookAvailable = true;
                });
            },
            // 翻页
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev().then(() => {
                        const currentLocation = this.rendition.currentLocation();
                        this.progress = this.locations.percentageFromCfi(currentLocation.start.cfi);
                        this.progress = Math.round(this.progress * 100)
                    })
                }
            },
            nextPage() {
                if (this.rendition) {
                    this.rendition.next().then(() => {
                        const currentLocation = this.rendition.currentLocation();
                        this.progress = this.locations.percentageFromCfi(currentLocation.start.cfi);
                        this.progress = Math.round(this.progress * 100)
                    })
                }
            },
            // 菜单显示隐藏
            toggleTitleAndMenu() {
                this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow;
                if (!this.ifTitleAndMenuShow) {
                    this.$refs.menuBar.hideSetting()
                }
            },
            setFontSize(fontSize) {
                this.defaultFontSize=fontSize;
                if (this.themes) {
                    this.themes.fontSize(fontSize+'px')
                }
            },
            registerTheme() {
                this.themeList.forEach(theme => {
                    this.themes.register(theme.name,theme.style)
                })
            },
            setTheme(index) {
                this.themes.select(this.themeList[index].name);
                this.defaultTheme=index
            },
            onProgressChange(progress) {
                const percentage = progress /100;
                const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0;
                this.rendition.display(location)
            },
            jumpTo(href) {
                this.rendition.display(href)
                this.hideTitleAndMenu()
            },
            hideTitleAndMenu() {
                this.ifTitleAndMenuShow = false;
                this.$refs.menuBar.hideSetting();
                this.$refs.menuBar.hideContent()
            }
        },
        mounted() {
            this.showEpub()
        }
    }
</script>

<style scoped lang="scss">
    @import "../src/assets/styles/global";
    .ebook {
        position: relative;
        .read-wrapper {
            .mask {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 100;
                display:flex;
                width: 100%;
                height: 100%;
                .left {
                    flex: 0 0 px2rem(100);
                }
                .center {
                    flex: 1;
                }
                .right {
                    flex: 0 0 px2rem(100);
                }
            }
        }

    }
</style>