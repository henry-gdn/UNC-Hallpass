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

function get_session_var(sname){
	var v = null;
	return $.ajax( "/secure/api/get_session_var?n="+sname );
}

function set_session_var(sname,sval){
 	return $.ajax( "/secure/api/set_session_var?n="+sname+"&v="+sval );
}



function load_test_sites(){
    $.ajax({
        url: '/secure/api/get_test_sites?all=true',
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
        success: function(data){
            console.log('data found:');
	        for (i=0; i<data.length; i++){
				var dhtml2 = "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12'>";
				dhtml2 += "<div class='mt-2 mb-3 p-0 reserveContent-1'>"
 				dhtml2 += "</div>";
				dhtml2 += "<div class='head-content mb-0 p-0'>";
                dhtml2 += "<h2 class='content-title'>"+data[i].site_name + "<br/>" + data[i].site_location +"</h2>";
  				dhtml2 += "</div>";
				dhtml2 += "<div class='reserve-btn p-0 mt-3' data-location='"+data[i].site_id+"'><button aria-label='FIND RESERVATIONS AT " + data[i].site_name + "' class='btn btn-block'>FIND RESERVATIONS<i class='feather icon-chevron-right'></i></button></div><br><br>";
				dhtml2 += "</div>";
		        $('#locations').append(dhtml2);
	        }
            $(document).on('click','.reserve-btn',function(){
				set_session_var('res_location', $(this).attr('data-location')).then(function(data){
					window.location.href = "location_view";
				});
            });
	    }
    });
}

function get_location_view_data(o){
	var urlVars = getUrlVars();
	var page = urlVars['page'];
	var s = $('.search-box').val();
	$.ajax({
		url: '/secure/api/get_site_reservations?s='+s+'&page='+page+'&o='+o,
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
		success: function(data){
			$('#reservations').html(data);
			$('.sort_link').on('click', function(){
				get_location_view_data($(this).attr('id'));
			});

		}
	});
}


function load_location_view(){
	get_location_view_data('');
	$('.btn-outline-search').on('click', function(){
		get_location_view_data('');
	});
}

function get_member_view_data(o){
	var s = $('.search-box').val();
	var status = $('#status-member').val();
	var affiliation = $('#affiliation').val();
	var page = getUrlVars()['page'];
	$.ajax({
		url: '/secure/api/get_member_listing?s='+s+'&st='+status+'&a='+affiliation+'&page='+page+'&o='+o,
		type: 'GET',
		headers: {
			"Access-Control-Allow-Origin": "https://hallpass-dev.unc.edu"
		},
		success: function(data){
			console.log('data found:');
			//console.log(data);
			$('.member-view-table').html(data);
			$('.sort_link').on('click', function(){
				get_member_view_data($(this).attr('id'));
			});
		}
	});
}

function load_member_view(){
	get_member_view_data('');
	$('.btn-outline-search').on('click', function(){
		get_member_view_data('');
	});
	$('#status-member').change(function(){
		get_member_view_data('');
	});
	$('#affiliation').change(function(){
		get_member_view_data('');
	});
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
				window.location.href = "/admin";
			}
		},
		error: function(data){
			window.location.href = "/admin";
		}
	});
}


/* common func on all pages */
$(document).ready(function(){
	if (window.location.href.endsWith('reports/')){
		check_access();
	}
	if (window.location.href.includes('test_sites')){
		load_test_sites();
	}
	if (window.location.href.includes('location_view')){
		load_location_view();
	}
	if (window.location.href.includes('member_view')){
		load_member_view();
	}
});
