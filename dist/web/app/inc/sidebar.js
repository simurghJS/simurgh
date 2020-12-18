import { ListView, ListItem, Navigate, Collapse, CollapseToggle, View } from "/core/components.js";

class Sidebar extends Component {
  async render(navigation_data = {}) {
    let nav = navigation_data.navigation_data.file;
    console.log(nav);
    return Arnahit.createElement(View, null, Arnahit.createElement("div", {
      className: "pt-5 pb-5"
    }, Arnahit.createElement("h3", {
      className: "text-center",
      dir: "ltr"
    }, env('app_name'), Arnahit.createElement("span", {
      className: "badge badge-primary"
    }, env('version')))), Arnahit.createElement(ListView, {
      listStyle: ListView.style.FLUSH
    }, Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "\u0634\u0631\u0648\u0639 \u0633\u0631\u06CC\u0639")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, {
      disabled: nav == "configuration" ? true : false,
      route: 'docs',
      data: {
        file: 'configuration'
      }
    }, "\u067E\u06CC\u06A9\u0631\u0647 \u0628\u0646\u062F\u06CC")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, {
      disabled: nav == "routing" ? true : false,
      route: 'docs',
      data: {
        file: 'routing'
      }
    }, "\u0631\u0648\u062A\u06CC\u0646\u06AF")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, {
      disabled: nav == "new_page" ? true : false,
      route: 'docs',
      data: {
        file: 'new_page'
      }
    }, "\u0627\u06CC\u062C\u0627\u062F \u0635\u0641\u062D\u0647 \u062C\u062F\u06CC\u062F")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, {
      disabled: nav == "api" ? true : false,
      route: 'docs',
      data: {
        file: 'api'
      }
    }, "\u06A9\u0627\u0631 \u0628\u0627 api")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, {
      disabled: nav == "helpers" ? true : false,
      route: 'docs',
      data: {
        file: 'helpers'
      }
    }, "helpers")), Arnahit.createElement(ListItem, null, Arnahit.createElement(View, null, Arnahit.createElement(CollapseToggle, {
      target: 'components'
    }, "\u06A9\u0627\u0645\u067E\u0648\u0646\u0646\u062A \u0647\u0627")), Arnahit.createElement(Collapse, {
      id: 'components'
    }, Arnahit.createElement(ListView, {
      listStyle: ListView.style.FLUSH
    }, Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "grids")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "htmlView")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "listView")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "buttons")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "collapse")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "cards")), Arnahit.createElement(ListItem, null, Arnahit.createElement(Navigate, null, "navigate")))))));
  }

}

export default Sidebar;