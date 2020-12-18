import {ListView, ListItem, Navigate, Collapse, CollapseToggle, View} from "/core/components.js";

class Sidebar extends Component {

    async render(navigation_data = {}) {
        let nav = navigation_data.navigation_data.file;
        console.log(nav);
        return (
            <View>

                <div className={"pt-5 pb-5"}>
                    <h3 className={"text-center"} dir={"ltr"}>
                        {env('app_name')}<span className={"badge badge-primary"}>{env('version')}</span>
                    </h3>
                </div>

                <ListView listStyle={ListView.style.FLUSH}>

                    <ListItem><Navigate>شروع سریع</Navigate></ListItem>
                    <ListItem><Navigate disabled={nav == "configuration" ? true : false} route={'docs'}
                                        data={{file: 'configuration'}}>پیکره بندی</Navigate></ListItem>
                    <ListItem><Navigate disabled={nav == "routing" ? true : false} route={'docs'}
                                        data={{file: 'routing'}}>روتینگ</Navigate></ListItem>
                    <ListItem><Navigate disabled={nav == "new_page" ? true : false} route={'docs'}
                                        data={{file: 'new_page'}}>ایجاد صفحه جدید</Navigate></ListItem>
                    <ListItem><Navigate disabled={nav == "api" ? true : false} route={'docs'}
                                        data={{file: 'api'}}>کار با api</Navigate></ListItem>
                    <ListItem><Navigate disabled={nav == "helpers" ? true : false} route={'docs'}
                                        data={{file: 'helpers'}}>helpers</Navigate></ListItem>

                    <ListItem>
                        <View>
                            <CollapseToggle target={'components'}>
                                کامپوننت ها
                            </CollapseToggle>
                        </View>
                        <Collapse id={'components'}>
                            <ListView listStyle={ListView.style.FLUSH}>
                                <ListItem><Navigate>grids</Navigate></ListItem>
                                <ListItem><Navigate>htmlView</Navigate></ListItem>
                                <ListItem><Navigate>listView</Navigate></ListItem>
                                <ListItem><Navigate>buttons</Navigate></ListItem>
                                <ListItem><Navigate>collapse</Navigate></ListItem>
                                <ListItem><Navigate>cards</Navigate></ListItem>
                                <ListItem><Navigate>navigate</Navigate></ListItem>
                            </ListView>
                        </Collapse>
                    </ListItem>
                </ListView>
            </View>
        )
    }

}

export default Sidebar;
