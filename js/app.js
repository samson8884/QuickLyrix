$(document).ready( function() {
    clearSessionStorage();
	$.ajaxSetup({
		error: function(event, jqXHR, ajaxSettings, thrownError) {
			if(event.statusText == "error") {
			 showMsg("Could not retrieve data. Please try running the app from a web server."); 
            } else {
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
		getLyrics(clickedEl.text().split("-")[0].split(".")[1].trim());
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
		$("#lyricsPage").css("font-size", parseInt($("#lyricsPage").css("font-size")) + 2);
		setColumnLayout();
	}
	
	function zoomOut() {
		$("#lyricsPage").css("font-size", parseInt($("#lyricsPage").css("font-size")) - 2);
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
        
		//move * to the end of the title so sorting will be proper
        /*for( var c = 0; c < titles.length; c++) {
            if(titles[c].indexOf("*") != -1) {
                titles[c] = titles[c].replace("* ", "") + "*";
            }
        }*/
        
        //sort titles
		titles.sort();
        //console.log(titles)
        
        //display titles 
		for( var c = 0; c < titles.length; c++) {
			var className = titles[c].indexOf("*") == -1 ? "not-popular" : "";
			var div = $("<div>").addClass("song-lbl " + className).html(c+1 +". "+titles[c].replace("*", ""));
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
		$("#lyricsPage").hide();
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
				$("#lyricsPage").empty().hide();                                         
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

					$("#lyricsPage").append(div);                            
				}				
				$("#lyricsPage").fadeIn();
				$("#zoomCntr").show();
                setColumnLayout();
                window.scrollTo(0,0);
			}
		});
	} 
	
	function setColumnLayout() {
		var $lyricsPage = $("#lyricsPage");
		$lyricsPage.removeClass("two-col three-col");
		if($lyricsPage.hasScrollBar()) {                    
			$lyricsPage.addClass("two-col");

			if($lyricsPage.hasScrollBar()) {                        
				$lyricsPage.addClass("three-col");
			}
		}
	}
	
	function setTitlesColumnLayout() {
		var $lyricsPage = $("#songTitlesCntr");
		$lyricsPage.removeClass("two-col three-col");
		if($lyricsPage.hasScrollBar()) {                    
			$lyricsPage.addClass("two-col");

			if($lyricsPage.hasScrollBar()) {                        
				$lyricsPage.addClass("three-col");
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
	
    // register the service worker if available
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('Successfully registered service worker', reg);
        }).catch(function(err) {
            console.warn('Error whilst registering service worker', err);
        });
    }
    
	getSongTitles(true); 
});