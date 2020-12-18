import { ListView, ListItem, CollapseToggle, Collapse, View } from "/core/Components.js";

class Changelog extends Component {
  async render(navigation_data) {
    return Arnahit.createElement(ListView, {
      listStyle: ListView.style.FLUSH
    }, Arnahit.createElement(ListItem, null, Arnahit.createElement(CollapseToggle, {
      target: "V_0_6_11_beta_0"
    }, "0.6.11-beta.0"), Arnahit.createElement(Collapse, {
      id: "V_0_6_11_beta_0"
    }, Arnahit.createElement(View, null, "\u0634\u0631\u0648\u0639 \u0648\u0631\u0698\u0646 \u0628\u0646\u062F\u06CC \u0641\u0631\u06CC\u0645 \u0648\u0631\u06A9."))));
  }

}

export default Changelog;