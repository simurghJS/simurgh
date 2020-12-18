import {ListView, ListItem,CollapseToggle,Collapse,View} from "/core/Components.js";

class Changelog extends Component {

    async render(navigation_data) {
        return (
            <ListView listStyle={ListView.style.FLUSH}>
                <ListItem>
                    <CollapseToggle target={"V_0_6_12_beta_0"}>0.6.12-beta.0</CollapseToggle>
                    <Collapse id={"V_0_6_12_beta_0"}>
                        <ListView>
                            <ListItem>پشتیبانی از gitignore</ListItem>
                        </ListView>
                    </Collapse>
                    <CollapseToggle target={"V_0_6_11_beta_0"}>0.6.11-beta.0</CollapseToggle>
                    <Collapse id={"V_0_6_11_beta_0"}>
                        <View>
                            شروع ورژن بندی فریم ورک.
                        </View>
                    </Collapse>
                </ListItem>
            </ListView>
        )
    }

}
export default Changelog;