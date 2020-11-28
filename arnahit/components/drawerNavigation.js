export default class DrawerNavigation {
    createDrawerNavigation(html) {
        let temp=$(html);
        let args = gApp.drawer_navigation;
        console.log(args);
        if (empty(gApp.drawer_navigation)) {
            $(temp).find("div[gilace-rel=drawer_navigation]").hide();
        } else {
            $(temp).find("div[gilace-rel=drawer_navigation]").show();

        }
        $(temp).find("div[gilace-rel=drawer_navigation]").html('');

        let navs = ``;
        if (Array.isArray(args)) {
            navs += `<ul>`;
            args.map((nav) => {
                if (!Array.isArray(nav.childs)) {
                    navs += `<li class="menu">
                                <button type="button" class="btn btn-link" gilace-navigate="${nav.action}"><span>${nav.name}</span></button>
                             </li>`
                } else {
                    let childs = ``;
                    nav.childs.map((chld) => {
                        childs += `<li class="menu">
                                        <button type="button" class="btn btn-link" gilace-navigate="${chld.action}"><span>${chld.name}</span></button>
                                    </li>`
                    });
                    navs += `<li class="menu">
                              
                               <button type="button" class="btn btn-link"> <span>
                                    <i class="fa fa-angle-left  pull-left"></i><span>${nav.name}</span>                                 
                                </span></button>
                                <ul>
                                    ${childs}
                                </ul>
                             </li>`
                }
            });
            navs += `</ul>`;
        }

        $(temp).find("div[gilace-rel=drawer_navigation]").html(navs);
        console.log($(temp)[0]);
        return html;
    }
}