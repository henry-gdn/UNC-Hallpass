function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function getUserInfo() {
    var userInfoCookie = getCookie('reg-user-info');
    var parts = userInfoCookie.split(',');
    return { 'name': parts[0], 'pid': parts[1] };
}
function getPID(){
    return getUserInfo().pid;
}

function load_step_1(){
    $.ajax({
	    url: '/secure/apiq?q=get_member_is_registered',
	    type: 'GET',
	    success: function(data){
                if (data[0].member_exists=='true')
	            window.location.href="home_post_auth.html";
		else
		    window.location.href="registration.html";
	    }
    });
}

function reg_step_1() {
    //$pid = getPID();
    $.ajax({
	url: '/secure/apip',
	type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'q': 'create_member'}),
	success: function(data){
		//console.log(data);
		window.location.href="registration_mobile_number.html";
	}	
    });
}
function goBack(){
	history.go(-1);
}

function load_step_2(){
    $.ajax({
	    url: '/secure/apiq?q=get_member_email_mobile',
	    type: 'GET',
	    success: function(data){
		    console.log('data found:'+data);
		    $('#preferred_email_address').val(data[0].email);
		    $('#phone_number').val(data[0].mobile);
	    }
    });
}

function reg_step_2(){
    //$pid = getPID();
    $email = $('#preferred_email_address').val();
    $mobile = $('#phone_number').val();
    $.ajax({
	    url: '/secure/apip',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({'q': 'update_member_email_mobile', email: $email, mobile: $mobile}),
	    success: function(data) {
		      var cookie_name = "reg-otp";
		      //console.log(data);
		      //console.log('otp = '+data[0].otp);
		      var cookie_value = data[0].otp;
	              var date = new Date();
		      var minutes = 10;
		      date.setTime(date.getTime() + (minutes * 60 * 1000));
		      var cookieStr = cookie_name+"="+cookie_value+",expires="+date+",SameSite=true,Secure=true,httpOnly=true";
		      //console.log(cookieStr);
		      document.cookie = cookieStr;
    		      window.location.href = "registration_mobile_2Stepverify.html";
	              //window.location.replace("registration_mobile_2Stepverify.html");
             }
    });
}

function checkOTP() {
    var otp = document.cookie.substr(8,5);
    if ($('#5_digit_code').val() == otp){
        console.log('otp validated successfully');
   	/* just added link for action flow */
        window.location.href = "registration_local_address.html";
    }
    else {
        alert('invalid otp entered, please retry!');
    }
}

function load_step_3(){
    $.ajax({
        url: '/secure/apiq?q=get_member_local_addr',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#street_1').val(data[0].street1);
            $('#street_2_opt').val(data[0].street2_opt);
            $('#city').val(data[0].city);
            $('#state').val(data[0].state);
            $('#zipcode').val(data[0].zipcode);
        }
    });
}

function reg_step_3(){
    //$pid = getPID();
    $las1 = $('#street_1').val();
    $las2 = $('#street_2_opt').val();
    $lac = $('#city').val();
    $las = $('#state').val();
    $laz = $('#zipcode').val();
    $.ajax({
	    url: '/secure/apip',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({'q': 'update_member_local_addr', las1: $las1, las2: $las2, lac: $lac, las: $las, laz: $laz}),
	    success: function(data) {
                window.location.href = "registration_mailing_address.html";
	        //window.location.replace("registration_mailing_address.html");
            }
    });
}

function load_step_4(){
    $.ajax({
        url: '/secure/apiq?q=get_member_mailing_addr',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#street_1').val(data[0].street1);
            $('#street_2_opt').val(data[0].street2_opt);
            $('#city').val(data[0].city);
            $('#state').val(data[0].state);
            $('#zipcode').val(data[0].zipcode);
        }
    });
}

function reg_step_4(){
    //$pid = getPID();
    $las1 = $('#street_1').val();
    $las2 = $('#street_2_opt').val();
    $lac = $('#city').val();
    $las = $('#state').val();
    $laz = $('#zipcode').val();
    $.ajax({
	    url: '/secure/apip',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({'q': 'update_member_mailing_addr', las1: $las1, las2: $las2, lac: $lac, las: $las, laz: $laz}),
	    success: function(data) {
		window.location.href = "registration_quarantine_address_choice.html";
            }
    });
}

function load_step_5(){
    $.ajax({
        url: '/secure/apiq?q=get_member_quarantine_choice',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#quarantine_address').val(data[0].qaddr);
        }
    });
}


function reg_step_5(){
    //$pid = getPID();
    $qaddr = $('#quarantine_address').val();
    $.ajax({
	    url: '/secure/apip',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({'q': 'update_member_quarantine_choice', qaddr: $qaddr}),
	    success: function(data) {
		if (data[0].address_type=='other')
                    window.location.href = "registration_quarantine_address.html";
		else
		    window.location.href = "registration_thx.html";
	    }
    });
}

function load_step_6(){
    $.ajax({
        url: '/secure/apiq?q=get_member_quarantine_addr',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#street_1').val(data[0].street1);
            $('#street_2_opt').val(data[0].street2_opt);
            $('#city').val(data[0].city);
            $('#state').val(data[0].state);
            $('#zipcode').val(data[0].zipcode);
        }
    });
}


function reg_step_6(){
    //$pid = getPID();
    $las1 = $('#street_1').val();
    $las2 = $('#street_2_opt').val();
    $lac = $('#city').val();
    $las = $('#state').val();
    $laz = $('#zipcode').val();
    $.ajax({
	    url: '/secure/apip',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({'q': 'update_member_quarantine_addr', las1: $las1, las2: $las2, lac: $lac, las: $las, laz: $laz}),
	    success: function(data) {
		window.location.href = "registration_thx.html";
	        //window.location.replace("registration_quarantine_address.html");
            }
    });
}

function reg_step_7(){
    window.location.href = "find_test_site.html";
}

/* common func on all pages */
$(document).ready(function(){
    var u = getUserInfo();
    console.log('updating user info');
    $('#member_name').length ? $('#member_name').html(u.name) : '';
    $('#member_pid').length ? $('#member_pid').html(u.pid) : '';
    if (window.location.href.endsWith('registration_mobile_number.html')){
        load_step_2();
    }
    if (window.location.href.endsWith('registration_local_address.html')){
        load_step_3();
    }
    if (window.location.href.endsWith('registration_mailing_address.html')){
        load_step_4();
    }
    if (window.location.href.endsWith('registration_quarantine_address_choice.html')){
        load_step_5();
    }
    if (window.location.href.endsWith('registration_quarantine_address.html')){
        load_step_6();
    }
});

