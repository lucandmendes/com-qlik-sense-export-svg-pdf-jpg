define(["jquery", "qlik", "./support-files/html2canvas", 
"css!./support-files/style.css"
],


function ($, qlik) {

	var app;
	app = qlik.currApp(this);
	
	var doc;
	var fileName;
	var field_Name;
	var field_Values = [];
	var field_Value;
	var temp_FieldName;
	var temp1_FieldName;
	var sheetName;
	var pre; //anychart Preloader
    var id_Value;   
	var span_id_Value;	
	var tbl_id;
    var i = 0;
    var j = 0;
	
    return {
		
		initialProperties : {
			version : 1.0,
			PDFSelect : true,
			JPEGSelect : true,
			SVGSelect : true
		},
	
		definition : {
			type : "items",
			component : "accordion",
			items : {
				settings : {
					uses : "settings",
					items: {
						PDFSelect: {
							type: "boolean",
							label: "PDF",
							ref: "PDFSelect",
							defaultValue: false
						},
						JPEGSelect: {
							type: "boolean",
							label: "JPEG",
							ref: "JPEGSelect",
							defaultValue: true
						},
						SVGSelect: {
							type: "boolean",
							label: "SVG",
							ref: "SVGSelect",
							defaultValue: true							
						},
					}
				}
			}
		},		
        paint: function ($element, layout) {
			
			
            temp_FieldName = layout.var_Field_Name;
            fileName = layout.var_File_Name;
            temp1_FieldName = app.field(temp_FieldName);
            temp1_FieldName.getData();
			
			id_ValuePDF  = layout.qInfo.qId + "_pdf";
			id_ValueJpeg = layout.qInfo.qId + "_jpeg";
			id_ValueSVG  = layout.qInfo.qId + "_svg";
			
			span_id_Value=layout.qInfo.qId + "_my_span_automate";
			
			tbl_id=layout.qInfo.qId + "_automate_tbl_ID";
			
			
			sheetName = document.title;
			
						
			var titles = [];
			
			if (sheetName.toLowerCase().indexOf("pt") !==-1){
				titles["JPG"] = "Exportar para JPG";
				titles["SVG"] = "Exportar para SVG";
				titles["PDF"] = "Exportar para PDF";
			}
			
			if (sheetName.toLowerCase().indexOf("en") !==-1){
				titles["JPG"] = "Export to JPG";
				titles["SVG"] = "Export to SVG";
				titles["PDF"] = "Export TO PDF";
			}			
			
			
			//calling base64Export to generate base64 string to get, if needed.
			base64PNG();
			
			stopAnimation();
			
								
			var htmlJpeg = "<td align='left' >"+
										"<img id='"+id_ValueJpeg+"' title='"+ titles["JPG"] + "' src='/extensions/com-qliktech-export-to-multiple-file/JPEG.png' height='25px' width='25px' class='img_cursor' name='my_image_automate'>"+
									"</td>";
									
			var htmlSvg = "<td  align='left' >"+
										"<img  id='"+id_ValueSVG+"' title='"+ titles["SVG"] + " ' src='/extensions/com-qliktech-export-to-multiple-file/SVG.png' height='25px' width='25px' class='img_cursor' name='my_image_automate'>"+
									"</td>";
									
			var htmlPdf = "<td  align='left' >"+
										"<img  id='"+id_ValuePDF+"' title='"+ titles["PDF"] + " ' src='/extensions/com-qliktech-export-to-multiple-file/PDF.png' height='25px' width='25px' class='img_cursor' name='my_image_automate'>"+
									"</td>";
									
												
			var html   =	"<table id='"+tbl_id+"' style='width: 50px;'><tr>";				
			
			if(layout.PDFSelect)
				html += htmlPdf;
			
			if(layout.JPEGSelect  === undefined || layout.JPEGSelect == true )
				html += htmlJpeg;
			
			if(layout.SVGSelect  === undefined  || layout.SVGSelect == true )
				html += htmlSvg;
		
			
			html +=	"</tr>"+
					"</table>"+
					"<div id='base64PNG' style='display:none;'></div>";		

            var container = $("#qv-toolbar-container").html();			
			
            $element.html(html);
         
			// Hidding elements
            function hideButton($param) {
				$("#"+tbl_id).hide();
				$("#qv-toolbar-container").hide();
                $(".qv-object-content ng-isolate-scope").hide();
				$(".sheet-title-container").hide();
				$("#sheet-title").hide();
				$(".qv-panel-subtoolbar").hide();
				$(".qv-panel-current-selections").hide();
							
				$(".qvt-selections").hide();
				
                $("div.qv-gridcell-nav.ng-scope.visible").hide();
                $("div.quick-navigation.ng-scope").hide();
                $("div.buttons-end.borderbox").hide();     
                
				return $param;
            }
			
			//$(document).ajaxStart(showAnimation).ajaxStop(hideAnimation);
		
			

			// PDF
            function printPDF() {
				
				var svgData = document.querySelector('svg').outerHTML;				
				
				// It has scroller:		
				if( 'xScroller' in window.chart ){
					
					var box = document.querySelector('svg').getBoundingClientRect();
					var width = box.right-box.left;
					var height = box.bottom-box.top;
					var fill = window.chart.xScroller().ca.fill;
					var selectedfill = window.chart.xScroller().ca.selectedFill;
					
					window.chart.height(3000);
					window.chart.xZoom().setToPointsCount(400);
					window.chart.xScroller().fill("#ffffff");
					window.chart.xScroller().selectedFill("#ffffff");
					
					
					//saving
					chart.saveAsPdf('a4', true, 50, 50, 'Pordata');
									
					// backing to original settings:					
					window.chart.height(height);
					window.chart.xZoom().setToPointsCount(30);
					window.chart.xScroller().fill(fill);
					window.chart.xScroller().selectedFill(selectedfill);
					
				}
				else if(svgData){
					
					var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
					var svgUrl = URL.createObjectURL(svgBlob);
					var image = new Image();
					
					image.src = svgUrl;
					var box = document.querySelector('svg').getBoundingClientRect();
					var width = box.right-box.left;
					var height = box.bottom-box.top;
					
					image.width = width;
				
					image.height = height;

					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');
					  
					image.onload = function() {
						canvas.width = image.width,canvas.height = image.height,					
						context.drawImage(image, 0, 0);
						image64 = canvas.toDataURL('image/png'); 
						
					 };		
			
					html2canvas(hideButton($("body")),
					{
						onrendered: function (canvas) {									  
							var imgData = canvas.toDataURL('image/jpeg');
							doc = new jsPDF('landscape','mm',[canvas.width, canvas.height]);
							doc.setProperties({
								title: 'PorData - Export',
								author: 'PorData'
							});		
							doc.text("PorData - Export",30,30);									
							doc.addImage(image, 'PNG', 100, 50, canvas.width, canvas.height - 10, "ScreenShot", "FAST", 360);
							
							doc.save("PorData.pdf");						 
							
						}
					});
				}  
				else {
					
					html2canvas(hideButton($("body")),
					{
						onrendered: function (canvas) {
													   
							var imgData = canvas.toDataURL('image/jpeg');
							doc = new jsPDF('landscape');
							doc.setProperties({
								title: 'PorData - Export',
								author: 'PorData'
							});		
						
							doc.addImage(imgData, 'PNG', 30, 15, 250, 120, "ScreenShot", "FAST", 360);
						
							doc.save("PorData.pdf");
						}
					}); 
				}
			}
			
			
			// JPG
			function printJPG() {
				
				svgData = document.querySelector('svg').outerHTML;
				
				// It has scroller:		
				if( 'xScroller' in window.chart ){				
					var box = document.querySelector('svg').getBoundingClientRect();
					var width = box.right-box.left;
					var height = box.bottom-box.top;
					var nWidth = Math.floor(width);
					var nHeight = 3000;
					var fill = window.chart.xScroller().ca.fill;
					var selectedfill = window.chart.xScroller().ca.selectedFill;
					
					window.chart.height(nHeight);
					window.chart.xZoom().setToPointsCount(400);
					window.chart.xScroller().fill("#ffffff");
					window.chart.xScroller().selectedFill("#ffffff");
					
					
					//saving
					window.chart.saveAsJpg(nWidth, nHeight, 0.9, true, 'Pordata');
									
					// backing to original settings:
					
					window.chart.height(height);
					window.chart.xZoom().setToPointsCount(30);
					window.chart.xScroller().fill(fill);
					window.chart.xScroller().selectedFill(selectedfill);
					
				}
				else if(svgData){
					
					if(window.chart){
						
						var box = document.querySelector('svg').getBoundingClientRect();
						var width = box.right-box.left;
						var height = box.bottom-box.top;
						var nWidth = Math.floor(width);
						var nHeight = (Math.floor(height)* 6);
						//Increasing to better image.	
						window.chart.height(nHeight);
						
						//saving
						window.chart.saveAsJpg(nWidth, nHeight, 0.9, true, 'Pordata');
										
						// backing to original settings:						
						window.chart.height(height);
						
						
					} else {
						// it probably is a native Qlik Sense chart
						var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
						var svgUrl = URL.createObjectURL(svgBlob);
						var image = new Image();
						image.src = svgUrl;
						
						var box = document.querySelector('svg').getBoundingClientRect();
						var width = box.right-box.left;
						var height = box.bottom-box.top;
						
						image.width = width;
					
						image.height = height;
					
						var canvas = document.createElement('canvas');
						var context = canvas.getContext('2d');

						image.onload = function() {
							canvas.width = width,canvas.height = height,
							context.drawImage(image, 0, 0);
							var a = document.createElement('a');
							a.download = "Pordata.jpg";
							a.href = canvas.toDataURL('image/png');
							a.style = 'display: none;';
							a.click();
						};
					}
					
				} else{
					// It has another kind of object wich is not svg or xml....
					html2canvas(hideButton($("body")),
					{
						onrendered: function (canvas) {													   
							
							var a = document.createElement('a');
							a.download = "Pordata.jpg"; 
							a.href = canvas.toDataURL('image/png'); 
							a.style = 'display: none;';
							a.click();	
						}
					}); 
				
				}
				
            }
					
			
		    // SVG
			function printSVG() {				
				
				var svgData = document.querySelector('svg').outerHTML;
				
				// It has scroller:		
				if( 'xScroller' in window.chart){
					
					var box = document.querySelector('svg').getBoundingClientRect();
					var width = box.right-box.left;
					var height = box.bottom-box.top;
					var fill = window.chart.xScroller().ca.fill;
					var selectedfill = window.chart.xScroller().ca.selectedFill;
					
					window.chart.height(3000);
					window.chart.xZoom().setToPointsCount(400);
					window.chart.xScroller().fill("#ffffff");
					window.chart.xScroller().selectedFill("#ffffff");
					
					
					//saving
					window.chart.saveAsSvg({"width": width,
											"height": 3000,
											"filename": 'Pordata'})
									
					// backing to original settings:
					
					window.chart.height(height);
					window.chart.xZoom().setToPointsCount(30);
					window.chart.xScroller().fill(fill);
					window.chart.xScroller().selectedFill(selectedfill);
					
					
				}				
				else if(svgData){
					
					if(window.chart){
						var box = document.querySelector('svg').getBoundingClientRect();
						var width = box.right-box.left;
						var height = box.bottom-box.top;
						var nWidth = Math.floor(width);
						var nHeight = (Math.floor(height)* 6);
						//Increasing to better image.	
						window.chart.height(nHeight);
						
						//saving
						window.chart.saveAsSvg({"width": nWidth,
											"height": nHeight,
											"filename": 'Pordata'});
																
						// backing to original settings:						
						window.chart.height(height);
						
						
					} else {					
						var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
						var svgUrl = URL.createObjectURL(svgBlob);
						var downloadLink = document.createElement("a");
						downloadLink.href = svgUrl;
						downloadLink.download = "Pordata.svg";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);
					}
				};
			} 		
            
			
			// Exporting base64 string to hidden div: base64PNG.
			function base64PNG() {				
				if(window.chart){
					 window.chart.getPngBase64String(function (response) {
						var base64String = document.getElementById('base64PNG');
						base64String.innerHTML = response;
					});
				}				
			}
			
			
			// Timeouts		
            function start_ProcessPDF() {
				//calling Anychart's preloader
				pre.visible(true);	
                window.setTimeout(printPDF, 1000);				
            }
			
			function start_ProcessJPG() {
				pre.visible(true);	
                window.setTimeout(printJPG, 1000);			
            }
			
			function start_ProcessSVG() {
				pre.visible(true);	
                window.setTimeout(printSVG, 1000);
            }
			
			
			//Buttons Click:
            $("#"+id_ValuePDF).click(
				function (event) {
					pre = window.anychart.ui.preloader();
					start_ProcessPDF();
				} 
			); 
			
			
			$("#"+id_ValueJpeg).click(
				function (event) {
					pre = window.anychart.ui.preloader();	
					start_ProcessJPG();					
				} 
			); 
			
			
			$("#"+id_ValueSVG).click(
				function (event) {	
					pre = window.anychart.ui.preloader();
					start_ProcessSVG();
				} 
			); 
								
			// To stop anychart animation...detected by any request on browser.
			function stopAnimation(){
				var oldXHR = window.XMLHttpRequest;

				function newXHR() {
					var realXHR = new oldXHR();
					realXHR.addEventListener("readystatechange", function() {
						if(realXHR.readyState==4 && realXHR.status==200){							
							pre.visible(false);							
						}
					}, false);
					return realXHR;
				}
				window.XMLHttpRequest = newXHR;
			
			}
		
        }
    };
		
});

