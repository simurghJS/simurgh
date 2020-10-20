import table from "./table.js";

class toolbar {
    constructor() {
        console.log('*** Initializing Toolbar ***')
        gilace.server.Get('crm/messages/count/unread', (responseJson) => {
            if (responseJson.count > 0) {
                $('#message_count').text(responseJson.count);
                $('#message_count').addClass('animated flash');
            } else {

                $('#message_count').text('');
                $('#message_count').removeClass('animated flash');
            }
        });

        $('#show_inbox_popup').on('click', function (event) {
            gilace.LayoutManager.render_component(new table({
                name: 'toolbar_inbox_table',
                url: 'crm/messages/unread_list',
                header:`<tr>
                            <th>نام</th>
                            <th>ایمیل فرستنده</th>
                            <th>تاریخ ثبت</th>
                            <th>مشاهده</th>
                        </tr>`
            }).loopData((message, index) => {
                return (`<tr>
                                        <td>${message.fullname}</td>
                                        <td>${message.email}</td>
                                        <td>${message.created_at}</td>
                                        <td><a href="#">مشاهده</a></td>
                                    </tr>`);
            }),'#load_message');
        });
        $(".toolbar_item_toggle").on('click', function (event) {
            $('.toolbar_submenu').hide();
            $(event.target).parent().find('.toolbar_submenu').toggle();
            event.stopPropagation();
        });
        $(window).click(function () {
            $('.toolbar_submenu').hide();
        });
        $('.toolbar_submenu').click(function (event) {
            event.stopPropagation();
        });
        $('#edit_admin_profile').click(()=>{
            gilace.navigation.navigate('person/admin/edit',{
                user_id:gilace.auth.get_auth().id
            });
        });
        $('#file_manager').click(()=>{
            gilace.filemanager.openDialog();
        })
    }
}

export default toolbar;