import {ListView, ListItem, Navigate} from "/core/components.js";

class Sidebar extends Component {

    async render(navigation_data = {}) {
        return (
            <ListView listStyle={ListView.style.FLUSH}>
                <ListItem>
                    <Navigate>خانه</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate route={'docs/quick_start'}>شروع سریع</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate>پیکره بندی</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate>روتینگ</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate>ایجاد صفحه جدید</Navigate>
                </ListItem>
                <ListItem>
                    <Navigate>سوئیچ بین صفحات</Navigate>
                </ListItem>
                <ListItem>
                    <p>
                        <a className={"btn btn-ListItemnk"} data-toggle={"collapse"} href={"#helpers"}
                           role={"button"}
                           aria-expanded={"false"} aria-controls={"helpers"} id="helpers_collapse">
                            ابزار ها
                        </a>
                    </p>
                    <div className={"collapse"} id="helpers">
                        <ListView listStyle={ListView.style.FLUSH}>
                            <ListItem>
                                <Navigate>کار با api</Navigate>
                            </ListItem>
                            <ListItem>
                                <Navigate>helpers</Navigate>
                            </ListItem>
                        </ListView>
                    </div>
                </ListItem>

                <ListItem>
                    <p>
                        <a className={"btn btn-ListItemnk"} data-toggle={"collapse"} href={"#collapseExample"}
                           role={"button"}
                           aria-expanded={"false"} aria-controls={"collapseExample"} id="collapseExample_collapse">
                            کامپوننت ها
                        </a>
                    </p>
                    <div className={"collapse"} id="collapseExample">
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
                    </div>
                </ListItem>
            </ListView>
        )
    }

    on_rendered() {
        let collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
        let collapseList = collapseElementList.map(function (collapseEl) {
            return new bootstrap.Collapse(collapseEl, {toggle: false, parent: '#' + collapseEl.id});
        })
    }

}

export default Sidebar;
