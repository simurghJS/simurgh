import { Card, CardBody, Cell, View, Button, ListView, ListItem, HtmlView } from "/core/components.js";

class Index extends Component {
  render(navigation_data = {}) {
    return Arnahit.createElement(View, null, Arnahit.createElement(View, {
      grid: true,
      className: 'fix-center'
    }, Arnahit.createElement("video", {
      autoPlay: 'autoplay',
      muted: 'muted',
      loop: 'loop',
      id: "myVideo"
    }, Arnahit.createElement("source", {
      src: "/resources/video/video.mp4",
      type: "video/mp4"
    })), Arnahit.createElement(Cell, {
      size: 6,
      offset: 3
    }, Arnahit.createElement(Card, {
      className: 'border-0'
    }, Arnahit.createElement(CardBody, {
      className: 'text-center'
    }, Arnahit.createElement(View, {
      className: 'p-3'
    }, Arnahit.createElement("h1", {
      className: 'card-title',
      style: {
        color: '#fdbb2d'
      }
    }, env('app_name'))), Arnahit.createElement(View, {
      className: 'p-3'
    }, Arnahit.createElement("h3", null, "\u0641\u0631\u06CC\u0645 \u0648\u0631\u06A9\u06CC \u0628\u0631 \u067E\u0627\u06CC\u0647 javascript \u0628\u0631\u0627\u06CC \u062A\u0648\u0633\u0639\u0647 \u0633\u0631\u06CC\u0639 ui")), Arnahit.createElement(View, {
      className: 'p-3'
    }, Arnahit.createElement("p", null, "MIT Licensed, v", env('version'), ",", Arnahit.createElement(Button, {
      type: 'link',
      onPress: () => {
        new Router().navigate('changelog');
      }
    }, "changelog"), ", developed by ", Arnahit.createElement("a", {
      href: "#"
    }, "siyamak beheshti"))), Arnahit.createElement(View, null, Arnahit.createElement(Button, {
      className: "btn-lg m-3",
      type: 'outline-light',
      onPress: () => {
        new Router().navigate('docs', {
          file: 'configuration'
        });
      }
    }, "\u0634\u0631\u0648\u0639 \u0622\u0645\u0648\u0632\u0634"), Arnahit.createElement(Button, {
      className: "btn-lg m-3",
      type: 'outline-light',
      onPress: () => {
        console.log('download button pressed');
      }
    }, "\u062F\u0627\u0646\u0644\u0648\u062F \u0646\u0633\u062E\u0647 ", env('version'))))))), Arnahit.createElement(View, {
      grid: true
    }, Arnahit.createElement(Cell, {
      size: 8,
      offset: 2,
      className: "p-3"
    }, Arnahit.createElement("h2", {
      className: "text-primary"
    }, "\u0622\u0634\u0646\u0627\u06CC\u06CC \u0633\u0631\u06CC\u0639 \u0628\u0627 ", env('app_name')), Arnahit.createElement("div", {
      className: "mb-5 mt-5"
    }, Arnahit.createElement("h3", null, "\u062F\u0627\u0646\u0644\u0648\u062F \u0648 \u0646\u0635\u0628"), Arnahit.createElement("div", {
      className: "p-3"
    }, Arnahit.createElement("p", null, "\u0628\u0631\u0627\u06CC \u0646\u0635\u0628 \u0627\u0628\u062A\u062F\u0627 ", env('app_name'), " \u0631\u0627 \u0627\u0632 \u0644\u06CC\u0646\u06A9 \u0632\u06CC\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0645\u0627\u06CC\u06CC\u062F, \u0648 \u062F\u0631 \u067E\u0648\u0634\u0647 \u0627\u06CC \u0628\u0627 \u0646\u0627\u0645 \u067E\u0631\u0648\u0698\u0647 \u062E\u0648\u062F, \u0641\u0627\u06CC\u0644 \u0631\u0627 \u0627\u0632 \u062D\u0627\u0644\u062A \u0641\u0634\u0631\u062F\u0647 \u062E\u0627\u0631\u062C \u06A9\u0646\u06CC\u062F. \u0633\u067E\u0633 \u062C\u0647\u062A \u0646\u0635\u0628 \u0633\u0627\u06CC\u0631 \u0646\u06CC\u0627\u0632\u0645\u0646\u062F\u06CC \u0647\u0627 \u062F\u0633\u062A\u0648\u0631", Arnahit.createElement("span", {
      className: "badge badge-light",
      style: {
        fontSize: 'small'
      }
    }, " npm install "), "\u0631\u0627 \u0627\u062C\u0631\u0627 \u0646\u0645\u0627\u06CC\u06CC\u062F. \u0641\u0627\u06CC\u0644 \u0646\u0635\u0628\u06CC \u0634\u0627\u0645\u0644 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u067E\u0627\u06CC\u0647 \u0627\u0633\u062A. \u062F\u0633\u062A\u0648\u0631", Arnahit.createElement("span", {
      className: "badge badge-light",
      style: {
        fontSize: 'small'
      }
    }, " npm run build-web "), "\u0631\u0627 \u0627\u062C\u0631\u0627 \u06A9\u0646\u06CC\u062F. \u067E\u0633 \u0627\u0632 \u0686\u0646\u062F \u0644\u062D\u0638\u0647 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0634\u0645\u0627 \u062F\u0631 \u067E\u0648\u0634\u0647 dist/web \u0627\u06CC\u062C\u0627\u062F \u0645\u06CC\u0634\u0648\u062F. \u0628\u0631\u0627\u06CC \u0627\u062C\u0631\u0627\u06CC \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u062F\u0631 local \u0645\u06CC\u0628\u0627\u06CC\u0633\u062A \u0627\u0628\u062A\u062F\u0627 \u0628\u0627 \u0627\u0628\u0632\u0627\u0631 \u0647\u0627\u06CC\u06CC \u0647\u0645\u0627\u0646\u0646\u062F MAMP \u06CC\u06A9 \u0647\u0627\u0633\u062A \u0627\u06CC\u062C\u0627\u062F \u06A9\u0646\u06CC\u062F(\u062F\u0631 \u0637\u0648\u0644 \u0627\u06CC\u0646 \u0622\u0645\u0648\u0632\u0634 \u0645\u0627 \u0622\u062F\u0631\u0633 example.com \u0631\u0627 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0622\u062F\u0631\u0633 \u0647\u0627\u0633\u062A \u062F\u0631 \u0646\u0638\u0631 \u0645\u06CC\u06AF\u06CC\u0631\u06CC\u0645) \u0648 \u0645\u0633\u06CC\u0631 \u0622\u0646 \u0631\u0627 \u067E\u0648\u0634\u0647 dist/web \u0642\u0631\u0627\u0631 \u062F\u0647\u06CC\u062F. \u0627\u06A9\u0646\u0648\u0646 \u0645\u06CC\u062A\u0648\u0627\u0646\u06CC\u062F \u0645\u0631\u0648\u0631\u06AF\u0631 \u0631\u0627 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F \u0648 \u0646\u062A\u06CC\u062C\u0647 \u0631\u0627 \u062F\u0631 \u0622\u062F\u0631\u0633 example.com \u0645\u0634\u0627\u0647\u062F\u0647 \u0646\u0645\u0627\u06CC\u06CC\u062F"), Arnahit.createElement("p", null, Arnahit.createElement("span", null, "\u0644\u06CC\u0646\u06A9 \u062F\u0627\u0646\u0644\u0648\u062F"), Arnahit.createElement("a", {
      href: "http://arnahit.com/downloads/arnahitJS.zip",
      target: "_blank"
    }, "http://arnahit.com/downloads/arnahitJS.zip")))), Arnahit.createElement("div", {
      className: "mb-5"
    }, Arnahit.createElement("h3", null, "\u0633\u0627\u062E\u062A\u0627\u0631 \u067E\u0648\u0634\u0647 \u0647\u0627"), Arnahit.createElement("div", {
      className: "p-3"
    }, Arnahit.createElement("p", null, "\u067E\u06CC\u0634 \u0627\u0632 \u0634\u0631\u0648\u0639 \u0628\u0647\u062A\u0631 \u0627\u0633\u062A \u0628\u0627 \u0633\u0627\u062E\u062A\u0627\u0631 \u067E\u06CC\u0634 \u0641\u0631\u0636 \u067E\u0648\u0634\u0647 \u0647\u0627 \u062F\u0631 ", env('app_name'), " \u0622\u0634\u0646\u0627 \u0634\u0648\u06CC\u062F.")), Arnahit.createElement(View, {
      grid: true
    }, Arnahit.createElement(Cell, {
      size: 6,
      offset: 3
    }, Arnahit.createElement(ListView, {
      listStyle: ListView.style.FLUSH
    }, Arnahit.createElement(ListItem, null, Arnahit.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, Arnahit.createElement("h6", null, "app"), Arnahit.createElement("p", {
      className: "text-black-50"
    }, "\u0641\u0627\u06CC\u0644 \u0647\u0627\u06CC \u0627\u062C\u0631\u0627\u06CC\u06CC js \u0645\u0631\u0628\u0648\u0637 \u0628\u0647 \u0635\u0641\u062D\u0627\u062A"))), Arnahit.createElement(ListItem, null, Arnahit.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, Arnahit.createElement("h6", null, "resources"), Arnahit.createElement("p", {
      className: "text-black-50"
    }, "\u06A9\u0644 \u0641\u0627\u06CC\u0644\u0647\u0627\u06CC \u0645\u0631\u0628\u0648\u0637 \u0628\u0647 ui \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0642\u0631\u0627\u0631 \u0645\u06CC\u06AF\u06CC\u0631\u062F"))), Arnahit.createElement(ListItem, null, Arnahit.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, Arnahit.createElement("h6", null, "core"), Arnahit.createElement("p", {
      className: "text-black-50"
    }, "\u0641\u0627\u06CC\u0644 \u0647\u0627\u06CC \u0645\u0631\u0628\u0648\u0637 \u0628\u0647 ", env('app_name')))), Arnahit.createElement(ListItem, null, Arnahit.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, Arnahit.createElement("h6", null, "dist"), Arnahit.createElement("p", {
      className: "text-black-50"
    }, "\u0641\u0627\u06CC\u0644\u0647\u0627\u06CC \u062E\u0631\u0648\u062C\u06CC"))))))), Arnahit.createElement(HtmlView, {
      src: 'quick_start.html'
    }))));
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