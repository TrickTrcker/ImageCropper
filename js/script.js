/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var options =
        {
            imageBox: '.imageBox',
            croppingBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: 'larger.jpg',
            cropArea: [200, 200],
        }
var cropping = new CusCropImage(options);
document.querySelector('#cropping_btn').addEventListener('click', function () {
    var blob = cropping.getBlob();
    var fd = new FormData();
    // Append our Canvas image file to the form data
    fd.append("userProfImgFile", blob, model.filename);
});
document.querySelector('#zoom_in_btn').addEventListener('click', function () {
    cropping.zoomIn();
});
document.querySelector('#zoom_out_btn').addEventListener('click', function () {
    cropping.zoomOut();
});
document.querySelector('#zoom_reset_btn').addEventListener('click', function () {
    cropping.zoomreset();
});
//        alert(DataSourceTransportor.r + ' -> ' + DataSourceTransportor.area());


