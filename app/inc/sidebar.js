import {ListView, ListItem, Navigate, Collapse, CollapseToggle, View} from "/core/components.js";

class Sidebar extends Component {

    async render(navigation_data = {}) {
        return (
            <ListView listStyle={ListView.style.FLUSH}>
                <ListItem>
                    <Navigate>خانه</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate route={'docs'} data={{file: 'quick_start'}}>شروع سریع</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate route={'docs'} data={{file: 'configuration'}}>پیکره بندی</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate route={'docs'} data={{file: 'routing'}}>روتینگ</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate route={'docs'} data={{file: 'new_page'}}>ایجاد صفحه جدید</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate route={'docs'} data={{file: 'navigation'}}>سوئیچ بین صفحات</Navigate>
                </ListItem>
                <ListItem>
                    <View>
                        <CollapseToggle target={'helpers'}>
                            ابزار ها
                        </CollapseToggle>
                    </View>
                    <Collapse id={'helpers'}>
                        <ListView listStyle={ListView.style.FLUSH}>
                            <ListItem>
                                <Navigate route={'docs'} data={{file: 'api'}}>کار با api</Navigate>
                            </ListItem>
                            <ListItem>
                                <Navigate route={'docs'} data={{file: 'helpers'}}>helpers</Navigate>
                            </ListItem>
                        </ListView>
                    </Collapse>
                </ListItem>

                <ListItem>
                    <View>
                        <CollapseToggle target={'components'}>
                            کامپوننت ها
                        </CollapseToggle>
                    </View>
                    <Collapse id={'components'}>
                        <ListView listStyle={ListView.style.FLUSH}>
                            <ListItem>
                                <Navigate>views & grids</Navigate>
                            </ListItem>
                            <ListItem>
                                <Navigate>htmlView</Navigate>
                            </ListItem>
                            <ListItem>
                                <Navigate>listView</Navigate>
                            </ListItem>
                            <ListItem>
                                <Navigate>buttons</Navigate>
                            </ListItem>
                            <ListItem>
                                <Navigate>cards</Navigate>
                            </ListItem>
                        </ListView>
                    </Collapse>
                </ListItem>
            </ListView>
        )
    }

}

export default Sidebar;
