import {Cell, View, Button} from "/core/components/grid.js";
import {Card, CardBody} from "/core/components/card.js";

class Index extends Component {
    render(navigation_data = {}) {
        return (
            <View grid className={'fix-center'}>
                <video autoPlay={'autoplay'} muted={'muted'} loop={'loop'} id={"myVideo"}>
                    <source src={"/resources/video/video.mp4"} type={"video/mp4"}/>
                </video>
                <Cell size={6} offset={3}>
                    <Card className={'border-0'}>
                        <View className={'p-3'}>
                            <h3 className={'card-title'} style={{color: '#fdbb2d'}}>
                                یک اپلیکیشن دیگر با Arnahit.JS
                            </h3>
                            <p>فریم ورکی بر پایه javascript برای توسعه سریع ui</p>
                        </View>
                        <CardBody className={'p-3'}>
                            <View grid>
                                <Cell size={6}>
                                    <View>
                                        <h6 style={{color: '#fdbb2d'}}>آشنایی با آرناهیت</h6>
                                        <p>این اپلیکیشن شامل مستندی کوتاه است. برای آشنایی بیشتر کلیک کنید</p>
                                        <Button className={"btn btn-outline-light"} onPress={() => {
                                            console.log('document button pressed');
                                        }}>
                                            شروع آموزش
                                        </Button>
                                    </View>
                                </Cell>
                                <Cell size={6}>
                                    <View>
                                        <h6 style={{color: '#fdbb2d'}}>دانلود و نصب</h6>
                                        <p>فعلا آنوهیت در نسخه آزمایشی
                                            {env('version')}
                                            به سر می برد.برای دانلود کلیک نمایید
                                        </p>
                                        <Button className={"btn btn-outline-light"} onPress={()=>{
                                            console.log('download button pressed');
                                        }}>
                                            دانلود نسخه {env('version')}
                                        </Button>
                                    </View>
                                </Cell>
                            </View>
                        </CardBody>
                    </Card>
                </Cell>
            </View>
        )
    }
    on_rendered() {
        console.log('component rendered');
    }
}

export default Index;