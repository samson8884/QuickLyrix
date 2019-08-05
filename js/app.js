$(document).ready( function() { 
	$.ajaxSetup({
		error: function(event, jqXHR, ajaxSettings, thrownError) {
			if(event.statusText == "error") {
			showMsg("Could not retrieve data. Please try running the app from a web server."); } else {
				showMsg("Could not retrieve data. <br>" + event.statusText);
				
		  }
			
		}
	});
	
	$.fn.hasScrollBar = function() {
		return this.height() > ($(window).height() - $(".search-cntr").outerHeight());
	}
	$.fn.disableSelection = function() {
		return this
				 .attr('unselectable', 'on')
				 .css('user-select', 'none')
				 .on('selectstart', false);
	};
	
	$("#zoomCntr").disableSelection();
	
	$("#popularTab").on("click", function(e) {
		e.preventDefault();
		$(this).addClass("active");
		$("#allTab").removeClass("active");
		$(".not-popular").hide();
	});
	
	$("#allTab").on("click", function(e) {
		e.preventDefault();
		$(this).addClass("active");
		$("#popularTab").removeClass("active");
		$(".not-popular").show();
	});

	$("#home").on("click", function(e) {
		e.preventDefault();                
		goHome();
	});
	
	$(document).on("keyup", function(e) {    
		//backspace, home or escape
		if(e.keyCode == 8 || e.keyCode == 36 || e.keyCode == 27) {
			e.preventDefault();
			goHome();
		}
        //plus
		else if(e.keyCode == 107) {
			e.preventDefault();
			zoomIn();
		}
        //minus
		else if(e.keyCode == 109) {
			e.preventDefault();
			zoomOut();
		}
        //end
        else if(e.keyCode == 35) {
			e.preventDefault();
			clearSessionStorage();
		}
	});
	
	$("#songTitlesCntr").on("click", ".song-lbl", function(e) {
		e.preventDefault();
		$('input.search-bar').val("");
		var clickedEl = $(e.currentTarget);
		getLyrics(clickedEl.text().split("-")[0].trim());
	});
	
	$("#plusBtn").on("click", function(e) {
		e.preventDefault();
		zoomIn();
	});
	
	$("#minusBtn").on("click", function(e) {
		e.preventDefault();
		zoomOut();
	});
	
	$("#closeBtn").on("click", function(e) {
		e.preventDefault();
		hideMsg();
	});
	
	$("#msgOverlay").on("click", function(e) {
		e.preventDefault();
		hideMsg();
	});
	
	$('input.search-bar').on("mouseup", function(e){
		e.preventDefault();
	});
	
	$('input.search-bar').on("focus", function(e) {
		e.preventDefault();
		$(this).select();
	});
	
	$("ul.dropdown-menu li a").on("click", function(e) {
		e.preventDefault();
	});	

	function goHome() {
		$('input.search-bar').val("");
		$('input.search-bar').focus();
		getSongTitles(true);
	}
	
	function zoomIn() {
		$("#mainCntr").css("font-size", parseInt($("#mainCntr").css("font-size")) + 2);
		setColumnLayout();
	}
	
	function zoomOut() {
		$("#mainCntr").css("font-size", parseInt($("#mainCntr").css("font-size")) - 2);
		setColumnLayout();
	}
    
    function clearSessionStorage() {
        sessionStorage.clear();    
    }
	
	function getSongTitles(isDisplay) {
		if(sessionStorage.songTitles) {
			showTitles();
		} else {
			console.log("getting song titles");
			$.ajax({
				url: "songlist.txt",
				dataType : "text",
				success: function(data) {
					var titles = [];
					var lines = data.split("\n");
					for (var i = 0; i < lines.length; i++) {
						if(lines[i].trim().length != 0) {
							titles.push(lines[i] + "");
						}
					} 
					sessionStorage.songTitles = JSON.stringify(titles);
					
					createAutocomplete();

					if(isDisplay) {
						showTitles();
					}

				}
			});
		}
	}
	
	function createAutocomplete() {
		var titles = JSON.parse(sessionStorage.songTitles);

		$('input.typeahead').typeahead({
				source: titles,
				onSelect: function(item) {
					var title = $("<p>").text(item.value).text();
					getLyrics(title.split("-")[0].trim()); //title may have artist also
					$('input.search-bar').blur();
				}
		});
	}
	
	function createTitles() {
	   $("#songTitlesCntr").empty();
		var titles = JSON.parse(sessionStorage.songTitles);
		titles.sort();  
		for( var c = 0; c < titles.length; c++) {
			var className = titles[c].indexOf("*") == -1 ? "not-popular" : "";
			var div = $("<div>").addClass("song-lbl " + className).html(titles[c]);
			$("#songTitlesCntr").append(div);                                        
		}
		setTitlesColumnLayout();
		$("#songCount").text(titles.length);
	}
	
	function showTitles() {
		if($("#songTitlesCntr").html().trim().length == 0) {
			createTitles();
			createAutocomplete();
		}
		$("#mainCntr").hide();
		$("#indexPage").fadeIn();  
		$("#zoomCntr").hide();
		if($(".tab").hasClass("active") == false) {
			$("#popularTab").trigger("click");
		}
	}
	
	function getLyrics(songTitle) {
		console.log("getting lyrics for " + songTitle);
		$.ajax({
			url: "songs/" + songTitle.replace("*","").trim() + ".txt",
			dataType : "text",
			success: function(data) {
				$("#indexPage").hide();
				$("#mainCntr").empty().hide();                                         
				var lines = data.split("\n");
				var titleFound = false;
				var div;
                var divClass = "odd";
				for (var i = 0, len = lines.length; i < len; i++) {
					if(!titleFound && lines[i].trim().length > 0) {
						div = $("<div>").addClass("song-title").html(lines[i]);
						titleFound = true;
					} else {
						div = $("<div>").addClass("song-line " + divClass).html(lines[i]);
						if(lines[i].indexOf('* "') != -1) {
							div.addClass("song-title");
						}
                        //change line colour after blank line is found
                        if(lines[i].trim().length == 0) {
                            if(divClass == "odd") {
                                divClass = "even";
                            } else {
                                divClass = "odd";
                            }
                        }
					}

					$("#mainCntr").append(div);                            
				}				
				$("#mainCntr").fadeIn();
				$("#zoomCntr").show();
                setColumnLayout();
			}
		});
	} 
	
	function setColumnLayout() {
		var $mainCntr = $("#mainCntr");
		$mainCntr.removeClass("two-col three-col");
		if($mainCntr.hasScrollBar()) {                    
			$mainCntr.addClass("two-col");

			if($mainCntr.hasScrollBar()) {                        
				$mainCntr.addClass("three-col");
			}
		}
	}
	
	function setTitlesColumnLayout() {
		var $mainCntr = $("#songTitlesCntr");
		$mainCntr.removeClass("two-col three-col");
		if($mainCntr.hasScrollBar()) {                    
			$mainCntr.addClass("two-col");

			if($mainCntr.hasScrollBar()) {                        
				$mainCntr.addClass("three-col");
			}
		}
	}
	
	function showMsg(msg) {
		$("body").addClass("no-scroll");
		var $msgOverlay = $("#msgOverlay");
		$("#msgTxt").html(msg);
		$("#msgCntr").addClass("slide-down");
		$msgOverlay.height($(window).height());
		$("#msgPage").show();  
	}
	
	function hideMsg() {
		$("#msgPage").fadeOut();               
		$("body").removeClass("no-scroll");
	}
	
	getSongTitles(true); 
});