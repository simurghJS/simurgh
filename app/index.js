import {Card, CardBody, Cell, View, Button, ListView, ListItem, HtmlView} from "/core/components.js";

class Index extends Component {
    render(navigation_data = {}) {
        return (
            <View>
                <View grid className={'fix-center'}>
                    <video autoPlay={'autoplay'} muted={'muted'} loop={'loop'} id={"myVideo"}>
                        <source src={"/resources/video/video.mp4"} type={"video/mp4"}/>
                    </video>
                    <Cell size={6} offset={3}>
                        <Card className={'border-0'}>
                            <CardBody className={'text-center'}>
                                <View className={'p-3'}>
                                    <h1 className={'card-title'} style={{color: '#fdbb2d'}}>
                                        {env('app_name')}
                                    </h1>
                                </View>
                                <View className={'p-3'}>
                                    <h3>فریم ورکی بر پایه javascript برای توسعه سریع ui</h3>
                                </View>
                                <View className={'p-3'}>
                                    <p>
                                        MIT Licensed, v{env('version')},

                                        <Button type={'link'} onPress={() => {
                                            new Router().navigate('changelog');
                                        }}>changelog</Button>

                                        , developed by <a href={"#"}>siyamak beheshti</a>
                                    </p>
                                </View>
                                <View>

                                    <Button className={"btn-lg m-3"} type={'outline-light'} onPress={() => {
                                        new Router().navigate('docs', {file: 'configuration'});
                                    }}>
                                        شروع آموزش
                                    </Button>
                                    <Button className={"btn-lg m-3"} type={'outline-light'} onPress={() => {
                                        console.log('download button pressed');
                                    }}>
                                        دانلود نسخه {env('version')}
                                    </Button>
                                </View>
                            </CardBody>
                        </Card>
                    </Cell>
                </View>
                <View grid>
                    <Cell size={8} offset={2} className={"p-3"}>
                        <h2 className={"text-primary"}>آشنایی سریع با {env('app_name')}</h2>
                        <div className={"mb-5 mt-5"}>
                            <h3>دانلود و نصب</h3>
                            <div className={"p-3"}>
                                <p>برای نصب ابتدا {env('app_name')} را از لینک زیر دریافت نمایید, و در پوشه ای
                                    با نام
                                    پروژه خود, فایل را از حالت فشرده خارج کنید. سپس جهت نصب سایر نیازمندی ها
                                    دستور
                                    <span className={"badge badge-light"}
                                          style={{fontSize: 'small'}}> npm install </span>
                                    را اجرا نمایید. فایل نصبی شامل اپلیکیشن پایه است. دستور
                                    <span className={"badge badge-light"}
                                          style={{fontSize: 'small'}}> npm run build-web </span>
                                    را اجرا کنید. پس از چند لحظه اپلیکیشن شما در پوشه dist/web ایجاد میشود. برای
                                    اجرای
                                    اپلیکیشن در local
                                    میبایست ابتدا با ابزار هایی همانند MAMP یک هاست ایجاد کنید(در طول این آموزش
                                    ما آدرس
                                    example.com را
                                    به عنوان آدرس هاست در نظر میگیریم) و مسیر آن را پوشه dist/web قرار دهید.
                                    اکنون
                                    میتوانید مرورگر را
                                    باز کنید و نتیجه را در آدرس example.com مشاهده نمایید
                                </p>
                                <p>
                                    <span>لینک دانلود</span>
                                    <a href={"http://arnahit.com/downloads/arnahitJS.zip"}
                                       target={"_blank"}>http://arnahit.com/downloads/arnahitJS.zip</a>
                                </p>
                            </div>
                        </div>
                        <div className="mb-5">
                            <h3>ساختار پوشه ها</h3>
                            <div className={"p-3"}>
                                <p>پیش از شروع بهتر است با ساختار پیش فرض پوشه ها در {env('app_name')} آشنا شوید.</p>
                            </div>
                            <View grid>
                                <Cell size={6} offset={3}>
                                    <ListView listStyle={ListView.style.FLUSH}>
                                        <ListItem>
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <h6>app</h6>
                                                <p className={"text-black-50"}>فایل های اجرایی js مربوط به صفحات</p>
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <h6>resources</h6>
                                                <p className={"text-black-50"}>کل فایلهای مربوط به ui در این پوشه قرار
                                                    میگیرد</p>
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <h6>core</h6>
                                                <p className={"text-black-50"}>فایل های مربوط به {env('app_name')}</p>
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <h6>dist</h6>
                                                <p className={"text-black-50"}>فایلهای خروجی</p>
                                            </div>
                                        </ListItem>
                                    </ListView>
                                </Cell>
                            </View>
                        </div>
                        <HtmlView src={'quick_start.html'}></HtmlView>
                    </Cell>
                </View>
            </View>
        )
    }

    on_rendered() {
        console.log('hi there! im rendered');
        $('code').each((i, e) => {
            let html = Prism.highlight($(e).text(), Prism.languages.javascript, 'javascript');
            $(e).html(html);
        });
    }
}

export default Index;