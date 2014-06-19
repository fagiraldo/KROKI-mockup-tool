/*****************************************************************
	KROKI Web Application Flat UI - JavaScript implementation

	Author: Milorad Filipovic [mfili@uns.ac.rs]
	Copyrigth (c) 2014 KROKI Team, 
					   Chair of Informatics
					   Faculty of Technical Sciences
					   Novi Sad, Serbia

	https://github.com/KROKIteam
 *****************************************************************/
$(document).ready(function(e) {
	
	//number of miliseconds that popup messages are being visible for
	var delay = 2000;
	//form (div.forms) that is currently being dragged
	var dragged = null;
	//offsets for dragging forms
	var ox = 0;
	var oy = 0;
	//remember username so it can be switched with logout text
	var username = $("#logoutLink").text();
	//if the username is shorter than the word "Logout", keep the minimal width of the link
	if(username.length < 6) {
		$("#logoutLink").outerWidth(88);
	}

	//delete dummy text generated by KROKI menu generator for empty divs
	$(".arrow-down").empty();
	$(".arrow-right").empty();

	/**************************************************************************************************************************
													   															   MENU EFFECTS
	 **************************************************************************************************************************/
	//PAGE LOAD ANIMATION
	//Slide down the navigation
	$("nav").slideDown("slow", function() {
		$("#mainMenu").fadeIn("fast", function() {
			$("#logoutDiv").fadeIn("slow");
		});
	});

	//MAKE MAIN MENU ITEMS INVERT COLORS ON MOUSE HOVER
	$(".menu").hover(function(e) {
		if($(this).parent().find("ul.L1SubMenu").css('visibility') === 'hidden') {
			$(this).parent().addClass("hover");
		}
	}, function(e) {
		if($(this).parent().find("ul.L1SubMenu").css('visibility') === 'hidden') {
			$(this).parent().removeClass("hover");	
		}
	});

	//OPEN SUBMENU ON CLICK
	// $(".menu") is a <div> within main menu list elements which contains text and down arrow
	// so getting parent of $(".menu") we get the actual <li> element
	$(".menu").click(function(e) {
		//if corresponding submenu is not allready open, open it while closing all other submenus
		if($(this).parent().find("ul.L1SubMenu").css('visibility') === 'hidden') {
			$(".menu").each(function(index, element) {
				$(this).parent().removeClass("hover");
				$(this).parent().find("ul.L1SubMenu").css({"visibility":"hidden"});
				$(this).parent().find("ul.L2SubMenu").hide();
			});
			$(this).parent().addClass("hover");
			$(this).parent().find("ul.L1SubMenu").css({"visibility":"visible"});
		}else {
			//if a submenu is open, just close it on click
			$(this).parent().addClass("hover");
			$(this).parent().find("ul.L1SubMenu").css({"visibility":"hidden"});
		}
	});

	//INVERT SUBMENU ITEMS COLORS ON MOUSE HOVER
	$("li.subMenuItem").hover(function(e) {
		e.stopPropagation();
		$(this).addClass("hover-li");
		$(this).find("span").addClass("arrow-right-hover");
	}, function(e) {
		e.stopPropagation();
		$(this).removeClass("hover-li");
		$(this).find("span").removeClass("arrow-right-hover");
	});

	//SHOW HIGHER LEVEL SUBMENUS ON CLICK
	$(".subMenuLink").click(function(e) {
		e.stopPropagation();
		// if submenu is not visible, click opens it
		if(!$(this).find("ul.L2SubMenu").is(":visible")) {
			// first close all others
			$(this).parent().find("ul.L2SubMenu").each(function(index, element) {
				$(this).hide();
			});
			$(this).children("ul.L2SubMenu").first().show();
		}else {
			//if submenu is allready opened, it is closed on click
			$(this).children("ul.L2SubMenu").first().hide();
		}

	});

	//SHOW "LOGOUT" TEXT WHEN HOVERING OVER USERNAME
	$("#logoutLink").hover(function() {
		//keep original width if username is longer than "Logout" so link doesn't shrink
		if(username.length > 6) {
			$(this).outerWidth($(this).outerWidth())
		}
		$(this).text("Logout");
	}, function(){
		$(this).text(username);
	});

	/**************************************************************************************************************************
													   															   FORM EFFECTS
	 **************************************************************************************************************************/

	//CREATE FORM <DIV> ON MENU ITEM CLICK
	$("li.subMenuItem").click(function(e) {
		if(!$(this).hasClass("subMenuLink")) {
			// Hide all the submenus
			$(".L1SubMenu").each(function(index, element) {
				$(this).css({"visibility":"hidden"});;
			});
			// Return the main menu color to inital values
			$("li.mainMenuItems").each(function(index, element) {
				$(this).removeClass("hover");
			});
			var activateLink = $(this).attr("data-activate");
			$.ajax({url: activateLink,
				type: 'GET', 
				success: function(data) {
					makeNewForm(data);
				},
			    error: function(XMLHttpRequest, textStatus, errorThrown) { 
			        $("#messagePopup").html(errorThrown);
			        $("#messagePopup").attr("class", "messageError");
					$("#messagePopup").slideToggle(300).delay(delay).slideToggle(500);
			    }
			});
		}
	});

	//FOCUS FORM ON CLICK
	$("#container").on("click", ".forms", function() {
		focus($(this));
	});

	//CLOSE FORM ON 'X' BUTTON CLICK
	$("#container").on("click", ".headerButtons", function(e) {
		e.stopPropagation();
		$(this).parent().parent().remove();
		delete $(this).parent().parent();
	});

	//FUNCTION THAT CREATES HTML FORMS
	function makeNewForm(data) {
		var newForm = $(document.createElement("div"));
		newForm.addClass("forms");
		newForm.html(data);
		$("#container").append(newForm);

		/*
		 * If number of columns is more than 6, add 200 pixels for each
		 */
		var columns = newForm.find("th").length;
		if(columns > 6) {
			var newWidth = columns*200;
			if(newWidth<$("#container").width()) {
				newForm.width(newWidth);
			}else {
				newForm.width("98%");
				newForm.css({
				    "top": 60,
				    "left": 20,
				});
			}
		}

		newForm.show();
		focus(newForm);
	}

	// Form is focused by applying 'focused' css class
	// which adds drop-shadow effect to it and puts the form in front of the others.
	// Only one form can be focused at a time.
	function focus(form) {
		$(".forms").each(function(index, element) {
			$(this).removeClass("focused");
			$(this).addClass("unfocused");
		});
		form.removeClass("unfocused");
		form.addClass("focused");
	}

	//DRAG FORMS WHEN DRAGGING HEADERS

	// mousedown on .formheaders - make current form draggable
	$("#container").on("mousedown", ".formHeaders", function(e) {
		dragged = $(this).parent();
		focus(dragged);
		//coordinates of a mouse
		var ex = e.pageX;
		var ey = e.pageY;
		//coordinates of the form
		var position = dragged.position();
		var fx = position.left;
		var fy = position.top;
		//offsets of these coordinates
		ox = ex - fx;
		oy = ey - fy;
		//offsets are calculated here to avoid calculation on mouse move
		//since the offsets stay the same during the dragging process
	});

	// mouseup  - stop dragging forms
	$("html").mouseup(function() {
		dragged = null;
	});

	$("html").mousemove(function(e) {
		if(dragged != null) {
			var ex = e.pageX;
			var ey = e.pageY;
			dragged.offset({
				left: ex - ox,
				top: ey - oy
			});
		}
	});

	/**************************************************************************************************************************
													   															 TABLE EFFECTS
	 **************************************************************************************************************************/

	// SELECT TABLE ROWS ON MOUSE CLICK
	// Only one row can be selected at a time
	$("#container").on("click", ".mainTable tbody tr", function() {
		$(this).parent().find("tr").removeClass("selectedTr");
		$(this).addClass("selectedTr");
	});

	// FIRST, LAST, PREVIOUS AND NEXT BUTTONS IMPLEMENTATIONS

	$("#container").on("click", "#btnFirst", function(e) {
		var tableDiv = $(this).closest("div.tableDiv");
		var firstTR = tableDiv.find(".mainTable tbody tr:first-child");
		tableDiv.find(".mainTable tbody tr").removeClass("selectedTr");
		//select first element
		firstTR.addClass("selectedTr");
		//scroll to top
		tableDiv.find(".tablePanel").scrollTop(0);
	});

	$("#container").on("click", "#btnPrev", function(e) {
		var tableDiv = $(this).closest("div.tableDiv");
		var tablePanel = tableDiv.find(".tablePanel");
		var selectedRow = tableDiv.find(".mainTable tbody tr.selectedTr");

		if(selectedRow.length > 0) {
			if(selectedRow.prev().length > 0) {
				var position = selectedRow.prev().position();
				selectedRow.removeClass("selectedTr");
				selectedRow.prev().addClass("selectedTr");
				//detect whent the selected row gets out of the view port, and scroll so it gets on top
				if(position.top < tablePanel.position().top) {
					tablePanel.scrollTop((selectedRow.next().index()-2) * selectedRow.next().outerHeight());
				}
			}
		}
	});

	$("#container").on("click", "#btnNext", function(e) {
		var tableDiv = $(this).closest("div.tableDiv");
		var tablePanel = tableDiv.find(".tablePanel");
		var selectedRow = tableDiv.find(".mainTable tbody tr.selectedTr");
		if(selectedRow.length > 0) {
			if(selectedRow.next().length > 0) {
				var position = selectedRow.next().position();
				selectedRow.removeClass("selectedTr");
				selectedRow.next().addClass("selectedTr");
				//detect whent the selected row gets out of the view port, and scroll so it gets on top
				if((position.top + selectedRow.next().outerHeight()) > (tablePanel.position().top + tablePanel.outerHeight()) ) {
					tablePanel.scrollTop((selectedRow.next().index()+2) * selectedRow.next().outerHeight());
				}
			}
		}
	});

	$("#container").on("click", "#btnLast", function(e) {
		var tableDiv = $(this).closest("div.tableDiv");
		var lastTR = tableDiv.find(".mainTable tbody tr:last-child");
		tableDiv.find(".mainTable tbody tr").removeClass("selectedTr");
		//select last element
		lastTR.addClass("selectedTr");
		//scroll to bottom
		var position = lastTR.position();
		tableDiv.find(".tablePanel").scrollTop(position.top);
	});

	/* SHOW NEXT POPUP BUTTON CLICK */
	$("#container").on("click", "#btnNextForms", function(e) {
		var form = $(this).closest("div.forms");
		var popup = form.find(".nextPopup");
		popup.css({
			'position': 'absolute',
			'left': $(this).position().left,
			'top': $(this).position().top + $(this).height() + 10 
		});
		popup.fadeToggle();
	});

	/**************************************************************************************************************************
													   														INPUT PANEL EFFECTS
	 **************************************************************************************************************************/
	$("#container").on("click", "#btnSwitch", function(e) {
		var formBody = $(this).closest(".formBody");
		var form = $(this).closest("div.forms");
		form.find(".nextPopup").hide();
		formBody.fadeOut("slow", function(e) {
			formBody.find(".tableDiv").hide();
			formBody.find(".operationsDiv").hide();
			formBody.find(".inputForm").show();
			formBody.fadeIn("slow");
		});
	});

	$("#container").on("click", "#button-cancel", function(e) {
		e.preventDefault();
		var formBody = $(this).closest(".formBody");
		formBody.fadeOut("slow", function(e) {
			formBody.find(".tableDiv").show();
			formBody.find(".operationsDiv").show();
			formBody.find(".inputForm").hide();
			formBody.fadeIn("slow");
		});
	});

	$("#container").on("click", "#button-ok", function(e) {
		e.preventDefault();
		var form = $(this).closest(".inputForm");
		var act = form.attr('action');
		var method = form.attr('method');
		$.ajax({
			type: method,
			url: act,
			data: form.serialize(),
			success: function (data) {
				$("#messagePopup").html(data);
				var clas = $("#messagePopup").find("p").attr("class");
				$("#messagePopup").attr("class", clas);
				$("#messagePopup").slideToggle(300).delay(delay).slideToggle(500);
			},
		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        $("#messagePopup").html(errorThrown);
				$("#messagePopup").attr("class", "messageError");
				$("#messagePopup").slideToggle(300).delay(delay).slideToggle(500);
		    }
		});
	});
});
