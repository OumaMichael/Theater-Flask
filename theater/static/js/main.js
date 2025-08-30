
// client side
var interactiveForm = function(callback = null){
    var CProj = $('#projection option:selected').val();
    var numSeats = $('#seats option:selected').val();
    if (numSeats === undefined)
        numSeats = 1;
    
    if (!CProj) {
        console.error("No projection selected");
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/ajax",
        contentType: "application/json",
        dataType: 'json',
        success: function(result) {
            if (callback != null){
                callback(result)
            }
            else{
                if (result && result.result && result.result[CProj] !== undefined) {
                    if (result.result[CProj] > 0)
                    {
                        $("#more-seats").show();
                        $("#no-more-seats").hide();
                        $("#seats").find('option').not(':first').remove();
                        for (var i = 1; i <= result.result[CProj]; i++) {
                            var stri = i.toString();
                            if (i != 1){
                                $("#seats").append($('<option>', {value:stri, text:stri}));
                            }
                        }
                        var price = 5;  // think if use price as attribute or fixed
                        var totalPrice = price * numSeats;
                        var strprice = 'Price:&nbsp;&nbsp;('+ price.toString()+ 'x'+ numSeats +') = '+totalPrice.toString() + '€';
                        $("#price").empty();
                        $("#price").append(strprice);
                    }else{
                        $("#more-seats").hide();
                        $("#no-more-seats").show();
                    }
                } else {
                    console.error("Invalid response format from server");
                }
            }
            
        },
        error: function(error){
            console.error("AJAX error:", error);
            // Show error message to user
            $("#more-seats").hide();
            $("#no-more-seats").show();
            $("#no-more-seats").html("<p style='color:red;'>Error loading seat availability. Please refresh the page.</p>");
        },
    });

}  

var Price = function(){
    var CProj = $('#projection option:selected').val();
    var numSeats = $('#seats option:selected').val();
    if (numSeats === undefined)
        numSeats = 1;
    
    if (!CProj) {
        console.error("No projection selected for price calculation");
        return;
    }
    
    var price = 5;  // think if use price as attribute or fixed
    var totalPrice = price * numSeats;
    var strprice = 'Price:&nbsp;&nbsp;('+ price.toString()+ 'x'+ numSeats +') = '+totalPrice.toString() + '€';
    $("#price").empty();
    $("#price").append(strprice);
}  

$(document).ready(function(){
    
    interactiveForm (function(data) {
        if (data && data.result) {
            for (var key in data.result){
                if (data.result[key] <= 0){
                    $("#proj" + key.toString() + " td.seats").html("<p style='color:red;'>0<p>");
                    $("#proj" + key.toString() + " td.sold").html("<a class='red'>SOLD OUT</a>")
                }else{
                    $("#proj" + key.toString() + " td.seats").html(data.result[key]);
                }
            }
        } else {
            console.error("Invalid data received for seat availability");
            // Show loading error in all seat cells
            $("td.seats").html("<span style='color:red;'>Error</span>");
        }
    });
    
})

$(function(){
    interactiveForm();
    Price();
})