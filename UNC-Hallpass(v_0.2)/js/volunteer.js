function isValidBarcode(b){
    var bar_code_regex = /(^CTTP-\d{3}-\d{4}$)/;
	if (!(bar_code_regex.test(b))) 
    	return false;
	else 
 		return true;
}

function isValidPid(z){
    var zip_regex = /^\d{9}$/;
 	if (!(zip_regex.test(z))) 
    	return false;
	else
 		return true;
}


// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function markInvalid(f){
	f.removeClass('hideErr');
	f.addClass('msgErr');
}

function get_session_var(sname){
	var v = null;
	return $.ajax( "/secure/api/get_session_var?n="+sname );
}

function set_session_var(sname,sval){
 	return $.ajax( "/secure/api/set_session_var?n="+sname+"&v="+sval );
}

function check_access(){
	$.ajax({
		url: '/secure/api/check_if_staff_or_volunteer',
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
		success: function(data){
			if ((data.is_staff) || (data.is_volunteer)){

			}
			else{
				window.location.href = "/";
			}
		},
		error: function(data){
			window.location.href = "/";
		}
	});
}

function refresh_access(){
	$.ajax({
		url: '/secure/api/is_logged_in',
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
		success: function(data){

		},
		error: function(data){
			alert('session timeout triggered');
			window.location.href = "/secure/api/login?r="+window.location.href;
		}
	});
}


function search_member(){
	//refresh_access();
    var member_pid = $('#enter_pid').val();
	if (isValidPid(member_pid)){
		check_demo_data(member_pid).then(function(data){
		  if (data[0].success == 'True'){
		    markValid($('#demoDataErr'));
		    $('#pidErr').addClass('hideErr');
		    $('#pidErr').removeClass('msgErr');
		    set_session_var('member_pid', member_pid).then(function(data){
				window.location.href = 'member_details';
		    });
		  }
		  else
			markInvalid($('#demoErr'));
		});
	}
	else{
		$('#pidErr').removeClass('hideErr');
		$('#pidErr').addClass('msgErr');
	}
}

function load_member_details(){
	$.ajax({
		url: '/secure/api/get_member_details',
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
		success: function(data){
			$('#dob').html(data[0].member_details[2]);
			$('#pid').html(data[0].member_details[0]);
			$('#dob_print').html(data[0].member_details[2]);
			$('#pid_print').html(data[0].member_details[0]);
			$('#member_status').html(data[0].member_details[3]);
			$('#group').html(data[0].member_details[4]);
			$('#next_test_by').html(data[0].member_details[5]);
			$('#reservation_date').html(data[0].member_details[6]);
			$('#reservation_time').html(data[0].member_details[7]);
			$('#reservation_location').html(data[0].member_details[8]);
		}
	});
	 $.ajax({
        url: '/secure/api/get_test_sites?all=true',
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
        success: function(data){
            console.log('data found:');
			console.log(data);
			get_session_var('selected_location').then(function(d){
			for (i=0; i<data.length; i++){
				var dhtml2 = "<div class='form-check'>";
				dhtml2 += "<input class='form-check-input' type='radio' name='selectLocation' id='"+data[i].site_id+"'" + (d.sval==data[i].site_id?'checked':'')+">";
				dhtml2 += "<label class='form-check-label' for='location_"+i+"'>";
				dhtml2 += data[i].site_name;
				dhtml2 += "</label>";
				dhtml2 += "</div>";
		        $('.location-wrapper').append(dhtml2);
                        
			}
			});
	        }
	});
	$('.btn-print').on('click', function(){
		var location = $("input[name='selectLocation']:checked").attr('id');
		if (location == undefined){
			markInvalid($('#locationErr'));
			return false;
		}
		else
			markValid($('#locationErr'));
		if (!isValidBarcode($('#enter_barcode').val())){
			markInvalid($('#barcodeErr'));
			return false;
		}
		else
			markValid($('#barcodeErr'));

        set_session_var('selected_location', location).then(function(data){});
		var test_data = $('#dob').html()+'^'+$('#pid').html()+'^'+$('#enter_barcode').val()+'^'+location;
		$.ajax({
			url: '/secure/api/add_member_test',
			contentType: 'application/json',
			type: 'POST',
			headers: {
				"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
			},
			data: JSON.stringify({'test_data': test_data}),
			success: function(data){
				print_label();
				setTimeout(function(){window.location.href = 'submit_test';},2000);
			}
		});
	});
	$('.btn-proceed').on('click', function(){
		print_label();
	});
}

function print_label() {
	var contents = document.getElementById("dvContents").innerHTML;
	var frame1 = document.createElement('iframe');
	frame1.name = "frame1";
	frame1.style.position = "absolute";
	frame1.style.top = "-1000000px";
	document.body.appendChild(frame1);
	var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
	frameDoc.document.open();
	frameDoc.document.write('<html><head><title>DIV Contents</title>');
	frameDoc.document.write('</head><body>');
	frameDoc.document.write(contents);
	frameDoc.document.write('</body></html>');
	frameDoc.document.close();
	setTimeout(function () {
		window.frames["frame1"].focus();
		window.frames["frame1"].print();
		document.body.removeChild(frame1);
	}, 500);
	return false;
}

function load_test_data(){
	get_session_var('test_data').then(function(data){
		var test_data = data.sval.split('^');
		$('#dob').html(test_data[0]);
		$('#pid').html(test_data[1]);
		$('#dob_print').html(test_data[0]);
		$('#pid_print').html(test_data[1]);
		$('#barcode').html(test_data[2]);
	});
	$('.btn-proceed').on('click', function(){
		print_label();
	});
	$('.btn-search').on('click', function(){
		window.location.href = 'search_member';
	});
}

function check_demo_data(member_pid){
    var result = false;
    return $.ajax({
	 url: '/secure/api/demographic_data_ok?pid='+member_pid,
         type: 'GET',
         headers: {
            	"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
         }
    });
}


/* common func on all pages */
$(document).ready(function(){
	if (window.location.href.endsWith('search_member')){
		check_access();
		setTimeout(function(){$('#enter_pid').focus();}, 1000);
		$('#enter_pid').keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				$('#search_pid').click();
				return false;
			} else {
				return true;
			}
		});
	}
	if (window.location.href.endsWith('member_details')){
		check_access();
		load_member_details();
	}
	if (window.location.href.endsWith('submit_test')){
		check_access();
		load_test_data();
	}
});
