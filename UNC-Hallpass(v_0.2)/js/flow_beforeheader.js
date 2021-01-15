function strToDate(dateString){
    let reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/
  , [,year, month, day, hours, minutes] = reggie.exec(dateString)
  , dateObject = new Date(year, month-1, day, hours, minutes);
  return dateObject;
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function markInvalid(f){
	f.removeClass('hideErr');
	f.addClass('msgErr');
}

function markValid(f){
	f.removeClass('msgErr');
	f.addClass('hideErr');
}

function isValidDate(d){
	var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
	if (!(date_regex.test(d))) 
    	return false;
	else 
		return true;
}

function isValidZip(z){
    var zip_regex = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/;
	if (!(zip_regex.test(z))) 
    	return false;
	else 
 		return true;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        //console.log(c);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function IsUserLoggedIn() {
	get_session_var('is_logged_in').then(
		function(data){
			if (data.sval == 'null'){
				//alert('not logged in ');
			}else{
				$('ul.navigation-menu li:nth-child(8)').hide();
				$('ul.navigation-menu li:nth-child(7)').show();
				$('footer table.footerMenu tbody tr td:nth-child(1) p:nth-child(3)').show();
				$('footer table.footerMenu tbody tr td:nth-child(1) p:nth-child(2)').hide();
			}
		}
	);
}

function getUserInfo() {
    /*var userInfoCookie = getCookie('reg-user-info');
    console.log(userInfoCookie);
    var parts = userInfoCookie.split(':');
	return { 'name': parts[0], 'pid': parts[1] };*/
	pid="";
	users_name=""

	return $.ajax({
        url: '/secure/api/get_member_email_mobile',
		type: 'GET',
		async: false
	});
	
	//return { 'name':users_name, 'pid': pid};
}

function getPID(){
    return getUserInfo().pid;
}

function redirect(){
    $.ajax({
        url: '/secure/api/get_member_is_registered',
        type: 'GET',
        success: function(data){
            if (data[0].member_exists=='true')
	        	window.location.href="home";
	    	else
	        	window.location.href="registration";
		}
    });
}

function save_registration() {
	if (!$('#agreeChk').is(":checked")){
		markInvalid($('#agreeChkErr'));
		return false;
	}
    $.ajax({
		url: '/secure/api/create_member',
		type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
		success: function(data){
	   	 	console.log(data);
	    	window.location.href="registration_mobile_number";
		}	
    });
}

function goBack(){
	//history.go(-1);
	
	if (window.location.href.endsWith('registration_mobile_number')) {
		window.location.href="registration";
	}
	if (window.location.href.endsWith('registration_mobile_verify')) {
		window.location.href="registration_mobile_number";
	}
	if (window.location.href.endsWith('enter_name')) {
		window.location.href="registration_mobile_verify";
	}
	if (window.location.href.endsWith('demographics')) {
		window.location.href="enter_name";
	}
	if (window.location.href.endsWith('registration_local_address')) {
		window.location.href="demographics";
	}
	if (window.location.href.endsWith('registration_quarantine_address_choice')) {
		window.location.href="registration_local_address";
	}
	if (window.location.href.endsWith('registration_quarantine_address')) {
		window.location.href="registration_quarantine_address_choice";
	}
}

function load_email_mobile(){
    $.ajax({
	    url: '/secure/api/get_member_email_mobile',
	    type: 'GET',
	    success: function(data){
		    console.log('data found:'+data);
		    $('#preferred_email_address').val(data[0].email);
		    $('#phone_number').val(data[0].mobile);
	    },
        error: function(data) {
             window.location.href= "error_500";
	    }
    });
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function save_mobile_email(){
    $email = $('#preferred_email_address').val();
    $mobile = $('#phone_number').val();
 	if (!validateEmail($email)){
        $("#emailMissing").removeClass("hideErr");
	}
	else {
        $("#emailMissing").addClass("hideErr");
	}

	/* ***********************************************************************
		phone number validation scripts for registration mobile number
	*********************************************************************** */
	var phoneNumber = /^\d*(?:\.\d{1,2})?$/;
	if (phoneNumber.test($mobile)) {
		if($mobile.length==10){
			//alert("validate successfully");
			$("#errMsg").addClass("hideErr");
            $("#errMsg_1").addClass("hideErr");
		} else {
			//alert('Please put 10  digit mobile number');
			$("#errMsg").removeClass("hideErr");
            $("#errMsg_1").addClass("hideErr");
			return false;
		}
	}
	else {
		//alert('Not a valid number');
		$("#errMsg").removeClass("hideErr");
        $("#errMsg_1").addClass("hideErr");
		return false;
	}
	/* End of validation scripts */
	/* *********************************************************************** */

    $.ajax({
	    url: '/secure/api/update_member_email_mobile',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({email: $email, mobile: $mobile}),
	    success: function(data) {
		      var cookie_name = "reg-em-mb";
		      var cookie_value = $email+","+$mobile;
	              var date = new Date();
		      var minutes = 10;
		      date.setTime(date.getTime() + (minutes * 60 * 1000));
		      var cookieStr = cookie_name+"="+cookie_value+",expires="+date+",SameSite=true,Secure=true,httpOnly=true";
		      document.cookie = cookieStr;
    		      window.location.href = "registration_mobile_verify";
             }
    });
}

function checkOTP() {
	/* ***********************************************************************
		OTP validation scripts for registration mobile number 
	********************************************************************* 
        */
	$otp = $('#5_digit_code').val();
	if ($otp.length==5){
            $.ajax({
	        url: '/secure/api/check_otp?otp='+$otp,
	        type: 'GET',
	        success: function(data){
		    console.log('data found:'+data);
                    if (data[0].otp_ok == 'true'){
		        //alert("otp validate successfully");
		        $("#otpErrMsg").addClass("hideOtpErr");
		        $("#otpErrMsg_1").addClass("hideOtpErr");
                        console.log('otp validated successfully');
                        //window.location.href = "registration_local_address";
						window.location.href = "enter_name";
                    }
                    else {
                        //alert('invalid otp entered, please retry!');
		        $("#otpErrMsg").removeClass("hideOtpErr");
                        $("#otpErrMsg_1").addClass("hideOtpErr");
	        	return false;
	            }
                 }
            });
	}
        else {
            //alert('invalid otp entered, please retry!');
	    $("#otpErrMsg").removeClass("hideOtpErr");
            $("#otpErrMsg_1").addClass("hideOtpErr");
	    return false;
        }
	/* End of validation scripts */   
	/* *********************************************************************** */
}

function sendnewotp(){
	$('#5_digit_code').val('');
	$.ajax({
		url: '/secure/api/resend_otp',
		type: 'GET',
		success: function(data) {
		}
	});
	return false;
}

function load_member_name(){
    $.ajax({
	    url: '/secure/api/get_member_name',
	    type: 'GET',
	    success: function(data){
		    console.log('data found:'+data);
		    $('#first_name').val(data[0].first_name);
		    $('#middle_name').val(data[0].middle_name);
 			$('#last_name').val(data[0].last_name);
			$('#date_of_birth').val(data[0].dob);
	    },
        error: function(data) {
             window.location.href= "error_500";
	    }
    });
}

function save_member_name(){
	$f = $('#first_name').val();
    $m = $('#middle_name').val();
    $l = $('#last_name').val();
 	$d = $('#date_of_birth').val();
	isvalid = true;
	if ($f == ''){
 		markInvalid($('#first_name_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#first_name_err_msg'));
	if ($l == ''){
		markInvalid($('#last_name_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#last_name_err_msg'));
	if ($d == '' || !isValidDate($d)){
		markInvalid($('#date_of_birth_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#date_of_birth_err_msg'));
	if (isvalid != true)
		return false;
    $.ajax({
	    url: '/secure/api/update_member_name',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({firstname: $f, middlename: $m, lastname: $l, dob: $d}),
	    success: function(data) {
                window.location.href = "demographics";
        }
    });
}

function load_demographics(){
    $.ajax({
        url: '/secure/api/get_member_demographics',
        type: 'GET',
        success: function(data){
            console.log('data found:');
			console.log(data[0]);
			if (data[0].success == 'True'){
				var gender = data[0].gender;
				var race = data[0].race;
				var ethnicity = data[0].ethnicity;
 				if (gender != null)
					$('#gender').val(gender);
				var selected=$("#race option:selected").map(function(){ return this.value }).get();
				if (race != null && race != ''){
					var races = race.split(';');
					for (var i=0; i<races.length-1; i++){
						$('.form-check-input[value=\''+races[i]+'\']').prop('checked', true);
						selected.push(races[i]);
					}
					console.log(selected);
					$('#race').val(selected);
					$('.multiselect-selected-text').html(race.substring(0,race.length-1).replaceAll(';',', '));
				}
				if (ethnicity != null)
					$('#ethnicity').val(ethnicity);
			}
        }
    });
}

function save_demographics(){
	$g = $('#gender').val();
    $r = $('#race').val();
    $e = $('#ethnicity').val();
	isvalid = true;
	if ($g == null || $g == ''){ 
		markInvalid($('#genderErr'));
		isvalid = false;
	}
	else
		markValid($('#genderErr'));
	if ($r == null || $r == ''){ 
		markInvalid($('#raceErr'));
		isvalid = false;
	}
	else
		markValid($('#raceErr'));
	if ($e == null || $e == ''){ 
		markInvalid($('#ethnicityErr'));
		isvalid = false;
	}
	else
		markValid($('#ethnicityErr'));
	if (!isvalid){
		return false;
	}
    $.ajax({
	    url: '/secure/api/update_member_demographics',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({gender: $g, race: $r, ethnicity: $e}),
	    success: function(data) {
                window.location.href = "registration_local_address";
         }
    });
}


function load_local_addr(){
    $.ajax({
        url: '/secure/api/get_member_local_addr',
        type: 'GET',
        success: function(data){
            console.log('data found:');
			console.log(data[0]);
            $('#street_1').val(data[0].street1);
            $('#street_2_opt').val(data[0].street2_opt);
            $('#city').val(data[0].city);
			$('#county').val(data[0].county);
            $('#state').val(data[0].state);
            $('#zipcode').val(data[0].zipcode);
        }
    });
}

function save_local_addr(){
    $las1 = $('#street_1').val();
    $las2 = $('#street_2_opt').val();
    $lac = $('#city').val();
	$lat = $('#county').val(); 
    $las = $('#state').val();
    $laz = $('#zipcode').val();
	isvalid = true;
	if ($las1 == ''){
		markInvalid($('#street1_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#street1_err_msg'));
	if ($lac == ''){
		markInvalid($('#city_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#city_err_msg'));
	if ($laz == '' || !isValidZip($laz)){
		markInvalid($('#zipcode_err_msg'));		
		isvalid = false;
	}
	else
		markValid($('#zipcode_err_msg'));	
	if ($lat == null){
		markInvalid($('#county_err_msg'));		
		isvalid = false;
	}
	else
		markValid($('#county_err_msg'));	
	if ($las == null){
		markInvalid($('#state_err_msg'));		
		isvalid = false;
	}
	else
		markValid($('#state_err_msg'));	
	if (isvalid != true)
		return false;

    $.ajax({
	    url: '/secure/api/update_member_local_addr',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({las1: $las1, las2: $las2, lac: $lac, lat: $lat, las: $las, laz: $laz}), // TODO
	    success: function(data) {
			window.location.href = "registration_quarantine_address_choice";
        }
    });
}

function load_step_4(){
    $.ajax({
        url: '/secure/api/get_member_mailing_addr',
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
    $las1 = $('#street_1').val();
    $las2 = $('#street_2_opt').val();
    $lac = $('#city').val();
    $las = $('#state').val();
    $laz = $('#zipcode').val();
    $.ajax({
	    url: '/secure/api/update_member_mailing_addr',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({las1: $las1, las2: $las2, lac: $lac, las: $las, laz: $laz}),
	    success: function(data) {
		window.location.href = "registration_quarantine_address_choice";
            }
    });
}

function load_quarantine_choice(){
    $.ajax({
        url: '/secure/api/get_member_quarantine_choice',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#quarantine_address').val(data[0].qaddr);
        }
    });
}


function save_quarantine_choice(){
    $qaddr = $('#quarantine_address').val();
	if ($qaddr == null || $qaddr == ''){
		markInvalid($('#quarantineErr'));
		return false;
	}
	else
		markValid($('#quarantineErr'));
    $.ajax({
	    url: '/secure/api/update_member_quarantine_choice',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({qaddr: $qaddr}),
	    success: function(data) {
		if (data[0].address_type=='other')
            window.location.href = "registration_quarantine_address";
		else
		    window.location.href = "registration_thx";
	    }
    });
}

function load_quarantine_addr(){
    $.ajax({
        url: '/secure/api/get_member_quarantine_addr',
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


function save_quarantine_addr(){
    $las1 = $('#street_1').val();
    $las2 = $('#street_2_opt').val();
    $lac = $('#city').val();
	$lat = $('#county').val(); 
    $las = $('#state').val();
    $laz = $('#zipcode').val();
	isvalid = true;
	if ($las1 == ''){
		markInvalid($('#street1_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#street1_err_msg'));
	if ($lac == ''){
		markInvalid($('#city_err_msg'));
		isvalid = false;
	}
	else
		markValid($('#city_err_msg'));
	if ($laz == '' || !isValidZip($laz)){
		markInvalid($('#zipcode_err_msg'));		
		isvalid = false;
	}
	else
		markValid($('#zipcode_err_msg'));	
	if ($lat == null){
		markInvalid($('#county_err_msg'));		
		isvalid = false;
	}
	else
		markValid($('#county_err_msg'));	
	if ($las == null){
		markInvalid($('#state_err_msg'));		
		isvalid = false;
	}
	else
		markValid($('#state_err_msg'));	
	if (isvalid != true)
		return false;
    $.ajax({
	    url: '/secure/api/update_member_quarantine_addr',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({ las1: $las1, las2: $las2, lac: $lac, lat: $lat, las: $las, laz: $laz}), 
	    success: function(data) {
		    window.location.href = "registration_thx";
	    }
    });
}

function load_registration_thx(){
    $.ajax({
        url: '/secure/api/get_member_email_mobile',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#member_status').html(data[0].status);
			console.log(data[0].nowplus84h);
			/*
			nowplus84h = new Date().addHours(84);
			console.log(nowplus84h);
 			dt84 = nowplus84h.toISOString().substring(0,16).replace('T',' ');
			*/
			$('#next_test_before').html(data[0].nowplus84h);
			if (data[0].name != ' '){
				$('#member_name').html(data[0].name);
 			}
			if (data[0].status == 'COMPLIANT')
 			    $(".validUntil").text('Valid through: ' + data[0].nowplus84h);
        }
    });
}

function load_home(){
    $.ajax({
        url: '/secure/api/get_member_email_mobile',
        type: 'GET',
        success: function(data){
            console.log('data found:'+data);
            $('#member_status').html(data[0].status);
			if (data[0].name != ' '){
				$('#member_name').html(data[0].name);
			}
        }
    });
}

function load_test_sites(){
    $.ajax({
        url: '/secure/api/get_test_sites',
        type: 'GET',
        success: function(data){
            console.log('data found:');
			console.log(data);
	        for (i=0; i<data.length; i++){
		        var dhtml = "<div class=\"col-12 content-p mt-2 mb-3 p-0 reserveContent\">";
		        if (data[i].site_img != null)
                    dhtml += "<img src=\"" + data[i].site_img + "\" />";
		        dhtml += "</div>";
		        dhtml += "<div class=\"col-12 head-content mb-0 p-0\">";
		        dhtml += "<h2 aria-labelledby=\"" + data[i].site_name + "\" aria-label=\"" + data[i].site_name + "\" class=\"content-title\">" + data[i].site_name + "<br/>" + data[i].site_location +"</h2>";
		        dhtml += "</div>";
		        dhtml += "<div class=\"col-12 mb-0 p-0 mt-2\">";
		        dhtml += "<h3 class=\"testing-title\">" + data[i].site_hours + "</h3>";
		        dhtml += "</div>";
		        dhtml += "<div class=\"col-12 reserve-btn p-0 mt-3\"  data-location='"+data[i].site_id+"#"+data[i].site_name+"#"+data[i].site_hours+"#"+data[i].people_in_line+"#"+data[i].site_img+"'>";
 		        dhtml += "<button aria-label=\"RESERVE TIME\" aria-labelledby=\"RESERVE TIME\" class=\"btn btn-block\">";
 		        dhtml += "RESERVE TIME";
		        dhtml += "<i class=\"feather icon-chevron-right\"></i>";
		        dhtml += "</button>";
		        dhtml += "</div>";

				var dhtml2 = "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12'>";
				dhtml2 += "<div class='mt-2 mb-3 p-0 reserveContent-1'>"
				if (data[i].site_img != null)
					dhtml2 += "<img src='"+data[i].site_img+"' />";
 				dhtml2 += "</div>";
				dhtml2 += "<div class='head-content mb-0 p-0'>";
                dhtml2 += "<h2 aria-labelledby='"+data[i].site_name+"' aria-label='"+data[i].site_name+"' class='content-title'>"+data[i].site_name + "<br/>" + data[i].site_location +"</h2>";
  				dhtml2 += "</div>";
				dhtml2 += "<div class='mb-0 p-0 mt-2'>";
				dhtml2 += "<h3 aria-labelledby='"+data[i].site_hours+"' aria-label='"+data[i].site_hours+"' class='findTestSite'>Hours: "+data[i].site_hours+"</h3>";
				dhtml2 += "</div>";
				dhtml2 += "<div class='reserve-btn p-0 mt-3' data-location='"+data[i].site_id+'#'+data[i].site_name+"#"+data[i].site_hours+"#"+data[i].people_in_line+"#"+data[i].site_img+"'><button aria-label='RESERVE TIME' aria-labelledby='RESERVE TIME' class='btn btn-block'>RESERVE TIME<i class='feather icon-chevron-right'></i></button></div><br><br>";
				dhtml2 += "</div>";
		        $('#siteContent').append(dhtml2);
	        }
            $(document).on('click','.reserve-btn',function(){
                var location = $(this).attr("data-location");
                localStorage.removeItem("site-location");
                localStorage.setItem("site-location", location);
                window.location.href = "find_test_site_slots";
            });

	    }
    });
}

function reg_step_7(){
    window.location.href = "find_test_site";
}

function getCurDate(idx){
    var today = new Date();
    var dd = (idx == 0) ? today.getDate() : today.getDate() + 1;
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    dd = dd + idx;
    if(dd<10) 
	dd='0'+dd;
    if(mm<10) 
	mm='0'+mm;
    return mm+'/'+dd+'/'+yyyy;
}

function formatDate0() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatDate() {
	var d = new Date(new Date().toLocaleString("en-US", {timeZone: "US/Eastern"}));
	var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');

}

function formatDateDisplay(d) {
  var yy = d.substring(2,4); 
  var mm = d.substring(5,7);
  var dd = d.substring(8,10);
  var dtstr = mm+'/'+dd+'/'+yy; // + ' ' + t;
  return dtstr;
}

function get_slots() {
    var appHtml ="", totHtml ="", locationName = "";
    var siteArray = localStorage.getItem("site-location").split("#");
	locationName = siteArray[0];
	var siteId = siteArray[0];
    $(".content-title").html(siteArray[1]);
    $(".testing-hour").html(siteArray[2]);
	$(".br_site_name").html(siteArray[1]);
	$(".br_site_name").attr("aria-labelledby", siteArray[1]);
	$(".br_site_name").attr("aria-label", siteArray[1]);
    //$(".testing-line").text("People in line : "+siteArray[2]);
    var imgUrl = "<img src='"+siteArray[3]+"'/>";
    //$(".reserveContent").append(imgUrl);
    var arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	var selectedDate = formatDate();
    var day = new Date(new Date().toLocaleString("en-US", {timeZone: "US/Eastern"})).getDay();	
    for (var i = 0 ;i <day; i++) {		           
        arr.push(arr.shift());			
    }	
    var str = arr.slice(0, 13).join(",");
    var aryDays = str.split(",");	

    var slots = [];
    $.ajax({
        url: '/secure/api/get_test_slots',
        type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify({ site_id: siteId, selected_date: selectedDate}),
	    success: function(data, status) {	
           console.log(data);
	       var appHtml = "";
		   var i = 0;
		   var k = 0;
		   var j = 0;
           while (k < 7){
	           if (data[i].length > 0){

                   var curDay = aryDays[i];
				   console.log(curDay);
	               var classCollapse = "";
	               var classHide = (j == 0) ? "show" : "" ;
	               var classCollapse = (j == 0) ? "" : "collapsed";
	               var startHtml = '<div class="card border shadow mb-3 dayCollapse " cur-day="'+j+'#'+curDay+'">';
	               startHtml += '<a data-toggle="collapse" href="#'+curDay+'_'+k+'" class="faq position-relative '+classCollapse+' " aria-expanded="false" aria-controls="'+curDay+'">';
	               startHtml += '<div class="card-header p-2">';
	           startHtml += '<h2 class="title mb-0 faq-question"> '+curDay+' </h2>';
	           startHtml += '</div></a><div id="'+curDay+'_'+k+'" class="collapse '+classHide+'" aria-labelledby="'+curDay+'" data-parent="#scheduleDetails">';
	           startHtml += '<div class="card-body p-4">';
	           var availSlot = '<div class="row time" cur-day-slots="'+j+'">';
	           for (var j = 0; j < data[i].length; j++) {
				   //var d1str = data[i][j].slot_date + ' ' + data[i][j].slot_start;
				   //console.log(d1str);
				   //console.log(d1str.replace(/ [AP]M$/i,''));
				   //var d1 = strToDate(d1str);
				   //console.log(d1);
				   //var d2 = new Date();
				   //console.log(d1.getTime());
				   //console.log(d2.getTime());
	               availSlot += '<div class="col-4 p-0 fillSlotBtn availSlotBtn availTime" avail-date="' + data[i][j].slot_date + '" avail-slot="'+data[i][j].slot_start+'"><button class="btn btn-default btn-sm"> '+data[i][j].slot_start+' </button></div>';
	           }
	           availSlot +="</div>";
                   var endHtml = '</div></div></div>';
                   $(".scheduleData").append( startHtml + availSlot + endHtml );
				k++;
	       }
            i++;
	    }
            $(document).on('click','.availTime',function(){
                var availTime = $(this).attr('avail-slot');
                var availDate = $(this).attr('avail-date');
                localStorage.setItem('avail-time', availTime);
                localStorage.setItem('avail-date', availDate);
                localStorage.setItem('location-id', siteArray[0]);
                localStorage.setItem('location-name', siteArray[1]);
                window.location.href = "find_test_site_confirmtime";
            });

	}
    });
}

function load_confirm_time(){
        var availSlot = localStorage.getItem("avail-time");
        var siteId = localStorage.getItem('location-id');
        var selectedDate = localStorage.getItem('avail-date');
        var locationName = localStorage.getItem('location-name');

	$(".btn-time-blue").append(availSlot);
 	$(".bookdate").append(formatDateDisplay(selectedDate));
	$(".locationname").append(locationName);
	/*
        var resHtml = '';
        resHtml = '<button class="btn btn-lg btn-time-blue">'+availSlot+'</button><h3 class="mt-4" aria-labelledby="" aria-label="">'+locationName+'</h3>';
        $(".reserve-time").attr('data-reserve',availSlot+"#"+locationName);
        $("#reserveBtn").show();
        console.log(resHtml);
        $(".reserveYes").append(resHtml);
        $(".reserveYes").show();
	*/
        $(document).on('click','.reserve-time',function(){
			$.ajax({
                url: '/secure/api/book_test_slot',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({'q': 'book_test_slot', 'site_id': siteId, 'selected_date': selectedDate, 'slot_start': availSlot}),
                success: function(data, status){
                    if (data[0].slot_booked == "true"){
                        var com = locationName +"#"+ selectedDate +'#'+ availSlot +"#"+ data[0].qrimg;
                        localStorage.setItem("confirm-slot",com);
                        window.location.href = "reservation";
                    }
                    else {
						if (data[0].reason == "slot_full")
						    window.location.href = "find_test_site_slot_full";
 						else if (data[0].reason == "slot_booked")
                            window.location.href = "find_test_site_slot_booked";
                    }

                }
            });
        });

}

function load_reservation() {
	/*
    var confirm_slot = localStorage.getItem("confirm-slot");
    var confirmSlot = "";
    if (confirm_slot != null){
	confirmSlot = confirm_slot.split('#');
        $('.locationName').text(confirmSlot[0]);
        $('.bookdate').text(confirmSlot[1]);
        $('.slot-time').text(confirmSlot[2]);
        $('.qrcode').html("<img src='/secure/qrimages/" + confirmSlot[3] + "'/>");
    }
    else*/
	$.ajax({
		url: '/secure/api/get_latest_reservation',
		type: 'GET',
		success: function(data) {
		    console.log(data);
		    confirmSlot = data[0]['confirm-slot'].split('#');
                    $('.locationName').text(confirmSlot[0]);
                    $('.bookdate').text(confirmSlot[1]);
                    $('.slot-time').text(confirmSlot[2]);
                    $('.qrcode').html("<img src='/secure/qrimages/" + confirmSlot[3] + ".png'/>");
			sid = confirmSlot[4];
		}
	});
}

function cancel_reservation() {
    $.ajax({
	    url: '/secure/api/cancel_reservation',
	    type: 'POST',
	    contentType: 'application/json',
 		data: JSON.stringify({'sid': sid}),
	    success: function(data) {
            console.log('data: ' + data);
 			window.location.href = 'cancel_thx';
	    }
    });
}

function load_my_testing(){
    localStorage.setItem("scanCount",0);
	set_session_var('scan_count', 0).then(function(data){});
	load_registration_thx();
	$.get("/secure/api/my_testing",
        function(data, status) {
 			var curHtml = '';
		    console.log(data[0]);
		    var curStatus = data[0].my_status;
            if (data[0].reservation_found == null)
				$('.my-reservations-btn').hide();
		    else{
                //$(".get_next_test_before_title").text();
				//if (curStatus=='COMPLIANT')
		    	   // $(".validUntil").text('Valid through: N/A');
			}

		    if (curStatus=='EXEMPT' || curStatus=='VOLUNTARY'){
				$('.get-test-title').parent().hide();
			}
 			$(".status").text(curStatus);
 			$(".myTestContent").text(data[0].msg);
 			if (data[0].test_found != null){
				$(".get_next_test_before_title").text(data[0].test_found[2]);
				if (curStatus=='COMPLIANT')
		    	    $(".validUntil").text('Valid through: ' + data[0].test_found[2]);
 		    }
			if(curStatus.toUpperCase() == 'NON-COMPLIANT'){
					$("#hallpass-hcolor").removeClass();
					$("#hallpass-hcolor").addClass('headTab-pink hallpassTable hidden-lg-up hidden-md-up');
					$("#hallpass-bcolor").removeClass();
					$("#hallpass-bcolor").addClass('testContentPink');
 				    $("#hallpass-bcolor").addClass('testContentPink');
			}else if(curStatus.toUpperCase() == 'EXEMPT'){
					$("#hallpass-hcolor").removeClass();
					$("#hallpass-hcolor").addClass('headTab-blueTest hallpassTable hidden-lg-up hidden-md-up');
					$("#hallpass-bcolor").removeClass();
					$("#hallpass-bcolor").addClass('testContentBlue');
			}else if(curStatus.toUpperCase() == 'VOLUNTARY'){
					$("#hallpass-hcolor").removeClass();
					$("#hallpass-hcolor").addClass('headTab-yellow hallpassTable hidden-lg-up hidden-md-up');
					$("#hallpass-bcolor").removeClass();
					$("#hallpass-bcolor").addClass('testContentYellow');
			}
			//$(".myTestQrImg").attr("src",data.qrImage);
        }
    );
}



function get_session_var(sname){
	var v = null;
	return $.ajax( "/secure/api/get_session_var?n="+sname );
}

function set_session_var(sname,sval){
 	return $.ajax( "/secure/api/set_session_var?n="+sname+"&v="+sval );
}

function load_start_new_test(){
 	//alert(localStorage.getItem("scanCount"));
	localStorage.removeItem("scanValue");
 	localStorage.removeItem("siteId");
	load_registration_thx();
	$.ajax({
        url: '/secure/api/get_test_sites?all=y',
        type: 'GET',
        success: function(data){
            //console.log('data found:');
			//console.log(data);
	        for (i=0; i<data.length; i++){
				var o = new Option(data[i].site_name, data[i].site_id);
				$(o).html(data[i].site_name);
				$("#test_site").append(o);
			}
			get_session_var('site_id').then(
				function(data){ 
					site_id = data.sval; 
					console.log('site_id is ' + site_id);
					if (site_id != 'null'){
						console.log('setting site');
						$('#test_site').val(site_id);
					}
				}
			);

			$.ajax({
		        url: '/secure/api/get_latest_test',
		        type: 'GET',
		        success: function(data) {
			        if (data[0].success) {
				        //console.log(data[0].latest_test[1]);
						$('.last-test-date').html(data[0].latest_test[1]);
						$('.next-test-date').html(data[0].latest_test[2]);
						$('.test-status-display').html(data[0].latest_test[3]);
						$('.test-site-display').html(data[0].latest_test[4]);
					}
					else {
						$('.test-status-div').hide();
					}
				}
			});
		}
	});


	var scanCount = 0; //localStorage.getItem("scanCount");
	$(".scanBarCode").hide();
	$(".manualBarCode").show();
	$("#manualBarCodeValue").val('CTTP-');
	$("#manualBarCodeValue").focus();
	/*
	get_session_var('scan_count').then(
		function(data){ 
			scanCount = data.sval; 
			console.log('scanCount is ' + scanCount);
			if(scanCount == null){
				scanCount = 0;
				//localStorage.setItem("scanCount",0);
				set_session_var('scan_count', 0).then(function(data){});
				//get_session_var('scan_count').then(
					//function(data){ scanCount = data.sval; }
				//);
				console.log('scancount now is ' + scanCount);
			}
			if(scanCount < 1){
				$(".scanBarCode").show();
				$(".mannualBarCode").hide();
			}
			else{
				$(".scanBarCode").hide();
				$(".manualBarCode").val('CTTP-')
				$("#manualBarCodeValue").show();
			    $("#manualBarCodeValue").focus();
				//localStorage.setItem("scanCount",0);
				set_session_var('scan_count', 0).then(function(data){});
			}
		}
	);
	*/

	$("#barcodeBtn").click(
        function(){
			var siteId = $('#test_site').val();
			if (siteId == 0){
				markInvalid($('#testSiteErr'));
				return false;
			}
			else
				markValid($('#testSiteErr'));
			var txtVal = $("#manualBarCodeValue").val();
			if(txtVal.trim() == ""){
				markInvalid($('#barCodeErrMsg'));
				return false;
			}
			else
				markValid($('#barCodeErrMsg'));
			$.ajax({
				url: '/secure/api/demographic_data_ok',
				type: 'GET',
				success: function(data) {
					if (data[0].success == 'True'){
						set_session_var('site_id', siteId).then(function(data){});
						var barCodeValue = txtVal;
                		if (barCodeValue != null){
							//alert('sending to server');
							upload_test_barcode(barCodeValue, siteId);
						}
					}
					else {
						markInvalid($('#demoDataErr'));
						return false;
					}
				}
			});
        }
	);
}

function scan_new_test(){
	var siteId = $('#test_site').val();
	if (siteId == 0){
		markInvalid($('#testSiteErr'));
		return false;
	}
    $.ajax({
        url: '/secure/api/demographic_data_ok',
        type: 'GET',
		success: function(data) {
            if (data[0].success == 'True'){
				set_session_var('site_id', siteId).then(function(data){});
				window.location.href = "scan_new_test";
			}
			else {
				markInvalid($('#demoDataErr'));
				return false;
			}
		}
	});
}

function start_scan(){
	let selectedDeviceId;
	codeReader = new ZXing.BrowserBarcodeReader()
	console.log('ZXing code reader initialized')
	codeReader.getVideoInputDevices()
			.then((videoInputDevices) => {
		//alert('selecting camera');
					selectedDeviceId = videoInputDevices[0].deviceId;
					frontCamera = videoInputDevices[0].deviceId;
					if (videoInputDevices.length > 1) {
							$(".switchCamera").show();
							frontCamera = videoInputDevices[0].deviceId;
							backCamera = videoInputDevices[1].deviceId
							selectedDeviceId = videoInputDevices[1].deviceId;
							openCamera(backCamera);
					}
					else
							openCamera(frontCamera);

			})
			.catch((err) => {
					console.error(err)
					setTimeout(function() {
						window.location.href = "scan_fail";
					}, 1000);
			})

        $(".cameraSwitch").click(function(){
                if(camera == "back"){
                        openCamera(frontCamera);
                        camera = "front";
                }else{
                        openCamera(backCamera);
                        camera = "back";
                }
                //window.location.href = "scan_complete.html";
        });
        $("#barcodeBtn").click(function(){
			window.location.href = "scan_complete";
        });
}

function scan_fail() {
	load_home();
	localStorage.setItem("scanCount",1);
 	set_session_var('scan_count', 1).then(function(data){});
 	get_session_var('site_id').then(function(){ console.log(data.sval);});
	//alert(localStorage.getItem("scanCount"));
}

function openCamera(selectedDeviceId){
	//alert('opening camera');
    setTimeout(function(){ window.location.href = "scan_fail"; }, 15000);
	codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then((result) => {
		//alert('scan completed from camera');
		localStorage.setItem("scanValue",result);
		$("#scanCompleteLayout").addClass("show").show();
		setTimeout(function(){
			var  barCodeValue = localStorage.getItem("scanValue");
			//alert(barCodeValue);
			get_session_var('site_id').then(
				function(data){ 
					//alert(data.sval)
					siteId = data.sval; 
					if (barCodeValue != null){
						//alert('sending to server')
						upload_test_barcode(barCodeValue, siteId);
					}
					else
						window.location.href="scan_fail";
				}
			);
		}, 12000);
	}).catch((err) => {
		//alert('scan failed from camera');
		//alert(err);
			console.error(err);

			$('#myModal').modal({
					show: true,
					backdrop: 'static',
					keyboard: false
			});
			window.location.href = "scan_fail";
	})
}

var subjects = [];
var ada = false;
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}
function handleKeyDown() {
    var downKeyEvent = $.Event("keydown");
    downKeyEvent.keyCode = $.ui.keyCode.DOWN;  // event for pressing "down" key
    var enterKeyEvent = $.Event("keydown");
    enterKeyEvent.keyCode = $.ui.keyCode.ENTER;
    $('.dataSearch').on("click", function(){ 
	$.getJSON( "/secure/api/search?format=json", {
		a: 'OFF', 
		q: $('.search-box').val(),
		d: ''
	}, function(data, status) {
		$(".results").empty();
		$("#no-results").hide();
		if (data[0].label == 'No results found')
		    $("#no-results").show();
		else{
			buildResultHtml(data,true);	
		}
	} );
    });
}

function gotoSelected(val) {
	saveRecentSearch(JSON.parse(val));
	localStorage.removeItem("RESDATA");
	localStorage.setItem("RESDATA", val);
	document.location.href = "class_details";
}

function handleitemSelect() {
$( ".search-box" )
  // don't navigate away from the field on tab when selecting an item
  .on( "keydown", function( event ) {
	if ( event.keyCode === $.ui.keyCode.TAB &&
		$( this ).autocomplete( "instance" ).menu.active ) {
	  event.preventDefault();
	}
  })
  .autocomplete({
	source: function( request, response ) {
	  $.getJSON( "/secure/api/search?format=json&d=&a=OFF", {
		q: extractLast( request.term )
	  }, response );
	},
	search: function() {
	  // custom minLength
	  var term = extractLast( this.value );
	  if ( term.length < 3 ) {
		return false;
	  }
	},
	focus: function() {
	  // prevent value inserted on focus
	  return false;
	},
	select: function( event, ui ) {
	  var terms = split( this.value );
	  // remove the current input
	  terms.pop();
	  // add the selected item
	  terms.push( ui.item.value );
	  // add placeholder to get the comma-and-space at the end
	  terms.push( "" );
	  this.value = terms.join( "" );
	  gotoSelected(ui.item.title);
	  return false;
	}
  })
  .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
	var title = JSON.stringify(item);
	item.title = title;
	if (item.instructor == undefined)
		item.instructor = '';
	if(item.label == "No matches found"){
		disabled: true
		return $( "<li class='ui-state-disabled'>" ).append( "No matches found" ).appendTo( ul );
	}else{
		return $( "<li>" )
			.append("<span><span style='float:left'>" + item.label + "</span> <span class='instructor-details-search' style='float:right'>" + item.instructor + "</span>" 				)
			.appendTo( ul );
	}
  }
}

function onSelect(){
	var val = $(this).find('.search-val').val();
	saveRecentSearch(JSON.parse(val));
	localStorage.removeItem("RESDATA");
	localStorage.setItem("RESDATA", val);
	document.location.href = "class_details";
}

function onRecentSelect(){
	var v = $(this).find('.search-val').val();
	localStorage.removeItem("RESDATA");
	localStorage.setItem("RESDATA", v);
	document.location.href = "class_details";
}

function buildResultHtml(data, result){
	var htmStr = "<br><div class='resultsText'> RESULTS </div>";
	for(var i=0;i<data.length;i++){
		console.log(data[i]);
		//this is json data we are going to use autocomplete
		subjects.push({label:data[i].subject_code,instructor:data[i].instructor,days:data[i].days});
		var title = JSON.stringify(data[i]);
		if(result){
			htmStr += "<span class='search-results'><a href='#'><table class='recent-result-table table' style='width:100% !important;border-bottom:1px solid #DDDDDD;'><tr><td><input type='hidden' class='search-val' " +
                             "value='" + title + "'><img class='recent-img' src='images/results-img.png' /></td><td><div class='row recent-results'><div class='col-xs-12 col-sm-12 col-md-6 col-lg-6 recent-subject-code'><p>" + data[i].subject_code + "</p></div><div class='col-xs-12 col-sm-12 col-md-6 col-lg-6 recent-instructor'><p>Instructor : <span>" + data[i].instructor + "</span></p></div></div></td></tr></table></a></span>";

		}
	}	
	$(".results").empty();
	$(".results").append(htmStr);
	$(document).on('click', '.search-results', onSelect);
}

function saveRecentSearch(searchData) {
    var selectedData = JSON.parse(localStorage.getItem("search_data"));
    if(selectedData == null) {
        var resArray = [];
	resArray.push(searchData);
        localStorage.setItem("search_data",JSON.stringify(resArray));
    }
    else {
	// push records down in list
	var resArray = [];
	var addnew = true;
	for (i=0; i<selectedData.length; i++){
	  if (selectedData[i].subject_code == searchData.subject_code && selectedData[i].instructor == searchData.instructor){
	     addnew = false;
	     break;
	   }

	 }
	 if (addnew){
	     resArray.push(searchData); 
	     for (i=0;i<selectedData.length; i++){
                 resArray.push(selectedData[i]);
                 if (i==5)
                    break;
	     }
	     localStorage.setItem("search_data",JSON.stringify(resArray));
	}
    }
}
	
function loadRecentSearch(){
    var recentSearch = localStorage.getItem("search_data");
    if (recentSearch != null) {
        var selectedData = JSON.parse(recentSearch);
        var resHtml = "<br><div class='resultsText'> RECENTLY SELECTED </div>";
        var len = selectedData.length - 1;
        for (var k = len; k >= 0; k--) {
		resHtml += "<a href='#' class='rslink'><table class='recent-result-table table' style='width:100% !important;border-bottom:1px solid #DDDDDD;'><tr><td><img class='recent-img' src='images/recent-icon.png' /></td><td><div class='row recent-results'><div class='col-xs-12 col-sm-12 col-md-6 col-lg-6 recent-subject-code'><p>" + selectedData[k].subject_code + "</p></div><div class='col-xs-12 col-sm-12 col-md-6 col-lg-6 recent-instructor'><p>Instructor : <span>" + selectedData[k].instructor + "</span><input type='hidden' class='search-val' value='"+JSON.stringify(selectedData[k])+"'></p></div></div></td></tr></table></a>";
         }
        $(".results").html(resHtml);
	$('.rslink').on("click", onRecentSelect);
    }
}

function load_scan_complete(){
	load_home();
	set_session_var('site_id', 0).then(function(data){});
}

function upload_test_barcode(barCodeValue, siteId){

	$.ajax({
		url: '/secure/api/upload_test_barcode',
		method: 'POST',
		data: JSON.stringify({ bc: barCodeValue, siteid: siteId }),
		success: function(data){
			if (data[0].success == 'True'){
				localStorage.removeItem("scanValue");
  	            window.location.href='scan_complete';
			}
			else{
                console.log(data[0].message);
				$('#barCodeErrMsg').removeClass('hideErr');
				$('#barCodeErrMsg').addClass('msgErr');
				
				if (data[0].message != ""){
					$('#barCodeErrMsg').text(data[0].message);
				}
				else{
					$('#barCodeErrMsg').text("An error occured with this order and it was not processed")
				}

				var tag = $("#barCodeErrMsg");
                $('html,body').animate({scrollTop: tag.offset().top},'slow');
 				if (localStorage.getItem("scanValue") != null){
					localStorage.removeItem("scanValue");
					window.location.href='scan_fail';
				}
 				else
					localStorage.removeItem("scanValue");
			}
		}
 	});

}

function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.search);
    return (results !== null) ? results[1] || 0 : false;
}

function load_slot_info(){
    //alert(urlParam('qc'));
    $.ajax({
        url: '/secure/api/get_slot_info?qc='+urlParam('qc'),
        method: 'GET',
        success: function(data){
            // display slot details on page
            console.log(data); 
            $('.bookdate').html(data[0].slot_date);
            $('.locationName').html(data[0].site_name);
            $('.slot-time').html(data[0].slot_time);
            $('.pid').html(data[0].pid);
	}
    });
}

function load_find_test_site_slot_full(){
	var availSlot = formatDateDisplay(localStorage.getItem("avail-date")) + ' ' + localStorage.getItem("avail-time");
	var locationName = localStorage.getItem('location-name');
	$('.booktime').text(availSlot);
	$('.locationName').text(locationName);
}

function load_find_test_site_slot_booked(){
    load_find_test_site_slot_full();
}

var schedlueOnHtml = "",appHtml="" ,totHtml = "";
function load_my_schedule(){
    $("body").tooltip({ selector: '.hallModal, .hallTooltip, .enterDoor, .exitDoor, .subject-code' , boundary: 'window' });
 	load_home();
    //As per current day schedule will be loaded
    var arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var day = (new Date(new Date().toLocaleString("en-US", {timeZone: "US/Eastern"}))).getDay();
    //var day = new Date().getDay();	
	//alert(day);
    for (var i = 0 ;i <day; i++) {		           
        arr.push(arr.shift());			
    }	
    var str = arr.slice(0, 7).join(",");
    var aryDays = str.split(",");			
    for (var j = 0; j < aryDays.length; j++) {  
        var curDay = aryDays[j];
        var classHide = (j == 0) ? "show" : "" ;
        var classCollapse = (j == 0) ? "" : "collapsed";
        var startHtml = "<div class='card border shadow mb-3 dayCollapse' cur-day='"+curDay+"'><a data-toggle='collapse' href='#"+curDay+"' class='faq position-relative "+classCollapse+" ' aria-expanded='false' aria-controls='"+curDay+"'><div class='card-header p-2'  ><h2 class='title mb-0 faq-question'> "+curDay+" </h2></div></a> <div id='"+curDay+"' class='collapse "+classHide+"' aria-labelledby='"+curDay+"' data-parent='#scheduleDetails'><div class='card-body' style='padding-top:0;'>";
        var endHtml = "</div></div></div>";
		if(j == 0){
	    	getDayActivity(curDay,startHtml,endHtml,0);		
        } else {
            totHtml += startHtml+endHtml;
		}
    }
    $(document).on('click', '.dayCollapse', function() {
         var curDay  = $(this).attr("cur-day");
         getDayActivity(curDay,"","",1);
    });
}

function getDayActivity(appDay,startHtml,endHtml,type) {				
    var curDay = appDay;
    //console.log( curDay );
    var d = curDay.substring(0,3).toLowerCase();
    $.get("/secure/api/my_schedule?d="+d, {},
        function(data, status) {	
            if( status == "success"){	
                console.log("call successfull: "+data.length);
				scheduleOnHtml = "",appHtml="";	
				var hrBorder = "<hr class='border-hr'>";
				if (data.length==0){
                    scheduleOnHtml += "<div class='container'><div class='noData'>NO DATA AVAILABLE</div></div>";
				}
				else{
                    for (var i = 0; i < data.length; i++) {
                        scheduleOnHtml += "<div class='row schedule-content pt-3'><div class='col-sm-12 col-xs-12 col-md-4 col-lg-4 justify-content-start'><p aria-label='Subject code : "+data[i].subject_code+"' class='subject-code p-0' data-toggle='tooltip' data-placement='top' title='"+data[i].subject_code+"'>"+data[i].subject_code+"</p><p aria-label='Subject name : "+data[i].subject_name+"' class='subject-name' ><span class='hallTooltip' data-toggle='tooltip' data-placement='top' title='"+data[i].subject_name+"'>"+data[i].subject_name+"</span></p><p aria-label='Instructor Name : "+data[i].instructor_name+"' data-toggle='tooltip' data-placement='top' title='"+data[i].instructor_name+"' class='instructor-schedule pt-3'>Instructor: <span>"+data[i].instructor_name+"</span></p><p class='location'>Location: <span aria-label='Location : "+data[i].location+"' data-toggle='tooltip' data-placement='top' title='"+data[i].location+"'>"+data[i].location+"</span></p><p aria-label='class time : "+data[i].class_time+"' class='classtime-table'>Class Time: <span>"+data[i].class_time+"</span></p></div><div class='col-sm-12 col-xs-12 col-md-4 col-lg-4 justify-content-start'><p class='entry-text'>ENTRY: <span class='entry-time' aria-label='entry time : "+data[i].entry_time+"'>"+data[i].entry_time+"</span></p><p class='suggested-door-name'>Suggested Door: <span aria-label='Suggested Door: "+data[i].entry_sug_door+"'>"+data[i].entry_sug_door+"</span></p><p class='suggested-door-name'>Accessible Door: <span aria-label='Accessible Door: "+data[i].entry_acc_door+"'>"+data[i].entry_acc_door+"</span></p></div><div class='col-sm-12 col-xs-12 col-md-4 col-lg-4 justify-content-start'><p class='exit-text'>EXIT: <span class='exit-time' aria-label='Exit Time: "+data[i].exit_time+"'>"+data[i].exit_time+"</span></p><p class='suggested-door-name'>Suggested Door: <span aria-label='Suggested Door: "+data[i].exit_sug_door+"'>"+data[i].exit_sug_door+"</span></p><p class='suggested-door-name'>Accessible Door: <span aria-label='Accessible Door: "+data[i].exit_acc_door+"'>"+data[i].exit_acc_door+"</span></p></div></div>";
                        if ( i != data.length-1 ) {
                            scheduleOnHtml += hrBorder;
                        }
                    }
                }		
            }
		    appHtml += startHtml+scheduleOnHtml+endHtml;
            display(appHtml,type,curDay);
        }						  	
    ); 			
}		

function display(appHtml,type,id){
    if( type == 0 ) {
        $(".scheduleData").append( appHtml+totHtml );	
    }else{		
        $("#"+id+" .card-body").html( appHtml);	
    }
}	

function load_class_details() {
		var key = getUrlParameter('param');
		console.log(key);
		var result = JSON.parse(localStorage.getItem("RESDATA"));
		var resHtml = "";
		if(key == "search"){
			var resHtml = "<p aria-label='Subject code' class='subject-code-details p-0'>" + result.subject_code + "</p><p aria-label='Subject name' class='subject-name-details p-0'>" + result.subject_name + "</p><p aria-label='class time : '+ result.class_time +'' class='classtime-table mt-3'> <span>" + result.class_time + "</span></p><p aria-label='Instructor name' class='instructor-schedule p-0'>" + result.instructor + "</p><p aria-label='location name' class='instructor-schedule p-0'>" + result.location + "</p><div class='mt-4'><p class='entry-text'>ENTRY : <span class='entry-time' aria-label='entry time : '+ result.entry_time +''>" + result.entry_time + "</span></p><p class='suggested-door-name-details'>Suggested Door : <span aria-label='Suggested Door: '+ result.entry_sug_door +''>"+ result.entry_sug_door +"</span></p><p class='suggested-door-name-acc-details'>Accessible Door : <span aria-label='Accessible Door: '+ result.entry_acc_door +''>"+ result.entry_acc_door +"</span></p><p class='exit-text pt-4'>EXIT : <span class='exit-time' aria-label='Exit Time: '+ result.exit_time +''>" + result.exit_time + "</span></p><p class='suggested-door-name-details'>Suggested Door : <span aria-label='Suggested Door: '+ result.exit_sug_door +''>"+ result.exit_sug_door +"</span></p><p class='suggested-door-name-acc-details'> Accessible Door : <span aria-label='Accessible Door: '+ result.exit_acc_door +''>"+ result.exit_acc_door +"</span></p></div> <br/><div class='search-details-btn mt-2'> <a href='class_search'><button aria-label='Class Search' class='btn btn-block'>CLASS SEARCH &nbsp;<i class='feather icon-chevron-right arrow-details'></i>&nbsp;</button></a></div><div class='search-details-btn mt-4'> <a href='my_schedule'><button aria-label='Class Search' class='btn btn-block'>MY SCHEDULE &nbsp;<i class='feather icon-chevron-right arrow-details'></i>&nbsp;</button></a></div><div class='row pt-4 mb-5'><div class='col mt-0 p-0 ml-1 justify-content-start'><p class='doorMap' aria-label='DOOR MAP'>DOOR MAP</p><div class='doorMapImg resDataImg mt-3 pr-1'> <img class='map-img' src='" + result.image_src + "' /></div></div></div>";
		}else{
			resHtml = "<p aria-label='Subject code' class='subject-code-details p-0'>" + result.subject_code + "</p><p aria-label='Subject name' class='subject-name-details p-0'>" + result.subject_name + "</p><p aria-label='class time : '+ result.class_time +'' class='classtime-table mt-3'> <span>" + result.class_time + "</span></p><p aria-label='Instructor name' class='instructor-schedule p-0'>" + result.instructor + "</p><p aria-label='location name' class='instructor-schedule p-0'>" + result.location + "</p><div class='mt-4'><p class='entry-text'>ENTRY : <span class='entry-time' aria-label='entry time : '+ result.entry_time +''>" + result.entry_time + "</span></p><p class='suggested-door-name-details'>Suggested Door : <span aria-label='Suggested Door: '+ result.entry_sug_door +''>"+ result.entry_sug_door +"</span></p><p class='suggested-door-name-acc-details'>Accessible Door : <span aria-label='Accessible Door: '+ result.entry_acc_door +''>"+ result.entry_acc_door +"</span></p><p class='exit-text pt-4'>EXIT : <span class='exit-time' aria-label='Exit Time: '+ result.exit_time +''>" + result.exit_time + "</span></p><p class='suggested-door-name-details'>Suggested Door : <span aria-label='Suggested Door: '+ result.exit_sug_door +''>"+ result.exit_sug_door +"</span></p><p class='suggested-door-name-acc-details'> Accessible Door : <span aria-label='Accessible Door: '+ result.exit_acc_door +''>"+ result.exit_acc_door +"</span></p></div> <br/><div class='search-details-btn mt-2'> <a href='class_search'><button aria-label='Class Search' class='btn btn-block'>CLASS SEARCH &nbsp;<i class='feather icon-chevron-right arrow-details'></i>&nbsp;</button></a></div><div class='search-details-btn mt-4'> <a href='my_schedule'><button aria-label='Class Search' class='btn btn-block'>MY SCHEDULE &nbsp;<i class='feather icon-chevron-right arrow-details'></i>&nbsp;</button></a></div><div class='row pt-4 mb-5'><div class='col mt-0 p-0 ml-1 justify-content-start'><p class='doorMap' aria-label='DOOR MAP'>DOOR MAP</p><div class='doorMapImg resDataImg mt-3 pr-1'> <img class='map-img' src='" + result.image_src + "' /></div></div></div>";
		}
        $(".resData").append(resHtml);
		//var imgHtml = "";
        //$(".resDataImg").append(imgHtml);
        //$(".resDataImg").append('<img class="hall-img" src="' + result.image_src + '" />');
        //$(".resDataImg").append('<img class="hall-img" src="images/Manning-Hall.png" alt="Building Maps Images" />');
}
	
var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
};

function load_class_search(){
	let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
        //Conditional script here
		var tag = $("#scrollto");
    	$('html,body').animate({scrollTop: tag.offset().top},'slow');
    }
}

/* common func on all pages */
$(document).ready(function(){
	//console.log('on load flowjs');
	//IsUserLoggedIn();
	//$('ul.navigation-menu li:nth-child(7)').hide();
	//$('footer table.footerMenu tbody tr td:nth-child(1) p:nth-child(3)').hide();
	getUserInfo().then(
		function(data){
			console.log('data found:'+data);
			if (data[0].name != ' '){
				users_name = data[0].name
			}
			if (data[0].pid != ' '){
				pid = data[0].pid
			}
			
			console.log('updating user info');
			$('#member_name').length ? $('#member_name').html(users_name) : '';
			$('#member_pid').length ? $('#member_pid').html(pid) : '';
        }
	);
	if (window.location.href.endsWith('registration_mobile_number')){
		load_email_mobile();
	}
	if (window.location.href.endsWith('enter_name')) {
		load_member_name();
	}
	if (window.location.href.endsWith('demographics')) {
		load_demographics();
	}
	if (window.location.href.endsWith('registration_local_address')){
		load_local_addr();
	}
	if (window.location.href.endsWith('registration_mailing_address')){
		load_step_4();
	}
	if (window.location.href.endsWith('registration_quarantine_address_choice')){
		load_quarantine_choice();
	}
	if (window.location.href.endsWith('registration_quarantine_address')){
		load_quarantine_addr();
	}
	if (window.location.href.endsWith('registration_thx')){
		load_registration_thx();
	}
	if (window.location.href.endsWith('home')){
		load_home();
	}
	if (window.location.href.endsWith('find_test_site')){
		load_test_sites();
	}
	if (window.location.href.endsWith('find_test_site_slots')){
		get_slots();
	}
	if (window.location.href.endsWith('find_test_site_confirmtime')){
		load_confirm_time();
	}
	if (window.location.href.endsWith('reservation')){
		load_reservation();
	}
	if (window.location.href.endsWith('my_reservations')){
		load_reservation();
	}
	if (window.location.href.endsWith('my_testing')){
		load_my_testing();
	}
	if (window.location.href.endsWith('my_schedule')){
		load_my_schedule();
	}
	if (window.location.href.endsWith('start_new_test')){
		load_start_new_test();
	}
	if (window.location.href.endsWith('scan_new_test')){
		start_scan();
	}
	if (window.location.href.endsWith('scan_fail')){
		scan_fail();
	}
	if (window.location.href.endsWith('scan_complete')){
		load_scan_complete();
	}
	if (window.location.href.includes('get_slot_info')){
		load_slot_info();
	}
	if (window.location.href.endsWith('find_test_site_slot_full')){
		load_find_test_site_slot_full();
	}
	if (window.location.href.endsWith('find_test_site_slot_booked')){
		load_find_test_site_slot_booked();
	}
	if (window.location.href.endsWith('class_search')){
		handleKeyDown();
		loadRecentSearch();
		handleitemSelect();
		load_class_search();
	}
	if (window.location.href.endsWith('class_details')){
		load_class_details();
	}

});

