<style type="text/css">
.triangle-block {
    width: 200px;
    height: 2px;
    position: absolute;
}
.triangle-block:after {
    content:"";
    width: 200px;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    border-top: 100px solid transparent;
    border-bottom: 100px solid rgba(221,51,51,1);
}
#red-triangle {
    left: 50px;
    top: 50px;
}
#red-triangle-2 {
    left: 550px;
    top: 250px;
}
</style>
<div data-u="slides" style="position: absolute; width: 800px; height: 450px; overflow: hidden;">
    <div style="width:800px;height:450px;background-color:#fff;">
        <div class="triangle-block" id="red-triangle"></div>
        <div style="position:absolute;left:300px;top:125px;width:200px;height:200px;">
            <div style="border-radius:0%;width:100%;height:100%;background-color:#000;">
            </div>
        </div>
        <div style="position:absolute;left:550px;top:225px;width:200px;height:200px;">
            <div style="border-radius:50%;width:100%;height:100%;background-color:rgb(30,115,190);">
            </div>
        </div>
    </div>
    <div style="width:800px;height:450px;background-color:rgb(26,183,33);">
        <div style="position:absolute;left:50px;top:50px;width:200px;height:200px;">
            <div style="border-radius:0%;width:100%;height:100%;background-color:rgb(60,145,220);">
            </div>
        </div>
        <div style="position:absolute;left:300px;top:125px;width:200px;height:200px;">
            <div style="border-radius:50%;width:100%;height:100%;background-color:#fff;">
            </div>
        </div>
        <div class="triangle-block" id="red-triangle-2"></div>
    </div>
</div>
