mapscale=1;

Vue.component("nav_panel",{
  template: "<nav><ul> \
<li @click='sw_page(\"zashare\")'>雜學校</li> \
<li @click='sw_page(\"map\")'>雜覽圖</li> \
<li @click='sw_page(\"attend\")'>參展單位</li> \
<li @click='sw_page(\"activity\")'>活動</li> \
</ul></nav>",
  props: ["svgdata","atlist",'nowviewing','sw_page'],
});
Vue.component("map_panel",{
  template: "<div><svg v-html=svgdata xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1207.56 810.71'></svg></div>",
  props: ["svgdata","atlist",'nowviewing']
});
$.ajax({
  url: "http://zashare.org/api/command.php?type=get&name=mapsvg",
  success: function(res){
    Vue.set(vm,"svgdata",res);

    setTimeout(function(){
      $("svg polygon,svg rect").hover(function(e){
         var key=$(this).attr('data-name');
         if (key){
           console.log(key);
           vm.nowviewing=vm.findname(key);
           if (vm.nowviewing){
             $(this).css("fill","white");
             $(this).css("stroke","#fd4f57");
             $(this).css("stroke-width","4px");
           
             $(this).css("cursor","pointer");
             
           }
         }
      },function(){
         $(this).css("fill","");
        $(this).css("stroke","");
        $(this).css("stroke-width","");
         vm.nowviewing=null;
      });
      
      
      


      isDragging=false;
      lastx=0;lasty=0;
      lasttx=0;lastty=0;
      $("svg")
      .mousedown(function(e) {
          isDragging = true;
          lastx=e.offsetX;lasty=e.offsetY;
          lasttx=parseInt($("[data-name='map_plane']").css("transform").split(",")[4].split(",")[0]);
          lastty=parseInt($("[data-name='map_plane']").css("transform").split(",")[5].split(")")[0]);
         
      })
      .mousemove(function(e) {
          if (isDragging){
             console.log("dragging!")
             $("[data-name='map_plane']").css("transform","scale("+mapscale+") translate("+((e.offsetX-lastx)/mapscale+lasttx)+"px,"+((e.offsetY-lasty)/mapscale+lastty)+"px) ");
             $("[data-name='map_plane']").css("transform-origin",((e.offsetX-lastx)/mapscale+lasttx)+"px "+((e.offsetY-lasty)/mapscale+lastty)+"px");
          }
       })
      .mouseup(function(e) {
          isDragging = false;  
        
      });
      
      $("[data-name='btn_zoomin']").css("cursor","pointer");
      $("[data-name='btn_zoomout']").css("cursor","pointer");
      $("[data-name='btn_zoomin']").click(function(){
        mapscale+=0.3;
        $("[data-name='map_plane']").css("transform","scale("+mapscale+") translate("+(lasttx)+"px,"+(lastty)+"px)");
      });
      $("[data-name='btn_zoomout']").click(function(){
        mapscale-=0.3;
        $("[data-name='map_plane']").css("transform","scale("+mapscale+") translate("+(lasttx)+"px,"+(lastty)+"px)");
      });
    },800);
    
  }
})



if (window.document.domain=="zashare.org"){
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-52977512-12', 'auto');
  ga('send', 'pageview');

}

Vue.component("attenditem",{
  template: "<div class='attenditem'> \
              <a class=cardtop :href='item.website' :title='\"前往\"+item.name_cht+\"的網站\"' target='_blank'> \
                <img class=icon :src='\"http://zashare.org/img/square_logos/\"+item.tag+\".jpg\"'> \
                <div class=topleft>\
                  <span class=itemtag v-html='item.tag'></span>\
                  <br>\
                  <h3 v-html='item.name_cht'></h3>\
                </div>\
              </a>\
              <hr>\
               <p> \
                  <span v-html='expand?item.discribe_cht:(item.discribe_cht.substr(0,max_len)+\"...\")'></span>\
                  <span v-if='item.discribe_cht.length>max_len && !expand' class=swex @click='expand=true'>更多</span>\
              </p>\
               <hr>\
               <span v-html='item.target_audience'></span>\
               <p v-html='item.teach_thing'></p>\
            </div>",
  props: ["item"],
  data: function(){
    return {
      expand: true,
      max_len: 130
    }
  }
});
Vue.component("attendpanel",{
  template: "<div><div id='search_headpart_space'></div> \
      <div id='search_headpart' :class='[(scroll_top>350)?\"fixtop\":\"\"]'><div class=container>\
      <h2 class='searchtitle white'>雜学校 參展攤位查詢</h2>&nbsp;&nbsp;<span class=white>(共{{filtered_list.length}}項結果):</span> \
      <div class='form-group'> \
        <input class='form-control input_filter' v-model='filter' placeholder='輸入代號、名字、或任何你想要搜尋的關鍵字'/> \
        <span class='keywordbtn' v-for='k in keywords' @click='filter=k'>{{k}}</span>\
        <span class=filter_cancel @click='filter=\"\"' title='清空篩選條件'>x</span>\
        </div> </div></div>\
            <div><br>\
                <ul v-if='wsize>=992' class='col-sm-4'> \
                <attenditem v-for='ll in splited_post3[0]' v-bind:item='ll'> </ul>\
                <ul v-if='wsize>=992' class='col-sm-4'> \
                <attenditem v-for='ll in splited_post3[1]' v-bind:item='ll'> </ul>\
                <ul v-if='wsize>=992' class='col-sm-4'> \
                <attenditem v-for='ll in splited_post3[2]' v-bind:item='ll'> </ul>\
                <ul v-if='wsize<992 && wsize>=768' class='col-sm-6'> \
                <attenditem v-for='ll in splited_post2[0]' v-bind:item='ll'> </ul>\
                <ul v-if='wsize<992 && wsize>=768' class='col-sm-6'> \
                <attenditem v-for='ll in splited_post2[1]' v-bind:item='ll'> </ul>\
                <ul v-if='wsize<768' class='col-sm-12'> \
                <attenditem v-for='ll in filtered_list' v-bind:item='ll'> </ul>\
            </div></div>",
  props: ["atlist","keywords","wsize","scroll_top"],
  data: function(){
    return {
      filter: "",
      liststyle: false
    }
  },
  computed: {
    filtered_list: function(){
      var newlist=[];
      if (this.filter==""){
        return this.atlist;
      }
      
      var pending=null;
      for(var i=0;i<this.atlist.length;i++){
        var atitem=this.atlist[i];
        var ff=this.filter.toLowerCase();
        
        if (atitem.tag.toLowerCase().indexOf(ff)!=-1 ||
            atitem.name_cht.toLowerCase().indexOf(ff)!=-1 ||
            atitem.discribe_cht.toLowerCase().indexOf(ff)!=-1 ||
            atitem.teach_thing.toLowerCase().indexOf(ff)!=-1){
          var clone=JSON.parse(JSON.stringify(atitem)) ;
          
          var res = new RegExp(ff, "i");
          // console.log(res);
          if (clone.tag.toLowerCase().indexOf(ff)!=-1)
            
            clone.tag=clone.tag.replace(clone.tag,"<span class=highlight>"+clone.tag+"</span>");
          clone.name_cht=clone.name_cht.replace(res,"<span class=highlight>"+this.filter+"</span>");
          clone.discribe_cht=clone.discribe_cht.replace(res,"<span class=highlight>"+this.filter+"</span>");
          clone.teach_thing=clone.teach_thing.replace(res,"<span class=highlight>"+this.filter+"</span>");
          
          if (atitem.name_cht!="墨雨設計")
            newlist.push(clone);    
          else
            pending=clone;
        }
      }
      if (pending){
        newlist.unshift(pending);
      }
      return newlist;
    },
    splited_post3: function(){
      var splist=[[],[],[]];
      for(var i=0;i<this.filtered_list.length;i++){
        splist[i%3].push(this.filtered_list[i]);
      }
      return splist;
    },
    splited_post2: function(){
      var splist=[[],[]];
      for(var i=0;i<this.filtered_list.length;i++){
        splist[i%2].push(this.filtered_list[i]);
      }
      return splist;
    }
  }
              
});

var vm = new Vue({
  el: "#app",
  data: {
    atlist: [],
    keywords: ["設計","小學","程式","翻轉","教育","遊戲"],
    wsize: $(window).width(),
    svgdata: "",
    nowviewing: null,
    nowpage: "attend",
    mousepos: {x: 0,y: 0},
    scroll_top: 0
  },
  template: "<div><div class='jumbotron'>\
  <div class='container'>\
    <nav_panel :sw_page='sw_page'/>\
  </div>\
</div>\
  <div>\
<div v-show=\"nowpage=='index'\" class=\"container page_index\"> \
    <h1 class=\"pagetitle\">學你想學 學你想成為------------------</h1>\
  </div>\
  <div v-show=\"nowpage=='zashare'\" class=\"container page_zashare\">\
    <section class=\"about\">\
      <h1>雜學校</h1>\
      <p>一個由民間自主發起由下而上的社會創新策展（前身為“不太乖教育節”）<br>建立1-99歲的「一站式教育資源平台」，聚集所有學校沒教/ 適合每一個你的不同學習路徑 ;<br>以台灣為震央，希望將這份影響力不僅凝聚國內教育創新正向力量，更擴及整個華人世界。<br></p>\
    </section>\
    <section class=\"open\">\
      <h1>開學資訊</h1>\
      <p>展期｜2016.11.26（六）-11.27（日）<br>展覽時間｜11.26（六）10:00am.--20:00pm.（19:30停止售票/檢票入場）<br><br>              11.27（日）10:00am.--18:00pm.（17:30停止售票/檢票入場）<br>地點｜台北.華山1914文化創意產業園區 東2ABCD四連棟、東3</p>\
      <p>優惠/免票說明（請於入場時出示相關證明）<br>=優惠票= （僅於現場販售｜單日優惠票 220元）<br>•	著制服進場者，可享優惠票價格（不限年紀）<br>•	現場持有效學生證者，可享優惠票價格（需為在學身分）<br>=免票資格=<br>- 持身心障礙手冊人士，憑證明文件可另攜一位陪同人免票入場<br>- 12歲以下（含12歲），65歲以上，出示相關證明文件可免票入場<br></p>\
      <p>購票請上：http://www.accupass.com/go/zashare</p>\
    </section>\
    <section class=\"mission\">\
      <h1>雜學，為了找回我們的哪吒</h1>\
      <h3>「哪吒太子，析肉還母，析骨還父。然後現本身，運大神力，為父母說法。」<br>＿《五燈會元》卷2</h3>\
      <p>每個孩子/或是曾經的自己都是哪吒。<br><br>從最美好的盼望而來，都曾三頭九眼八臂，把爸媽搞得焦頭爛額，幸福的精疲力盡。<br><br>然而世界太重了：哪吒的書包太重，只能把風火輪收進玩具箱。小考如鬼大考如魔，火尖槍難敵補習班。<br><br>小哪吒聽話，收起三頭八臂，專心做好一件事，身穿制服十二年，從此化為平凡人。不是平凡不好，而是被迫成為不是自己的自己。哪吒受縛，閉起火眼金睛，從此跌跌撞撞，認不出自己的臉，發不出自己的聲音。<br><br>如果可以啊，能不能再見體制，揮別填鴨，拔掉身上的標籤。讓每個塵世中的哪吒歸還虛胖的肉身、拆解規訓的骨架，讓哪吒們能成為自己的自己。<br><br>在這裡，我們想讓每個哪吒奔跑；想讓每個未來充滿可能性；想讓每個哪吒再度是那個三頭九眼八臂的自己。<br><br>雜學校，就是為了這個而已。</p>\
      <h1>觀展步驟 </h1>\
      <p>【雜學校入場券-拿回你的人生選擇權】<br>→【教育倡議-打開你人生/教育的想像】<br>→【創新教育實踐-看見改變的可能性】<br>→【互動體驗-改變不難，試試看】<br>【當你走出展場-我們希望你帶走的是有點被激動的心與嘗試改變的念頭】<br><br>撰寫：李佳穎/許皓甯<br></p>\
    </section>\
  </div>\
  <div v-show=\"nowpage=='map'\" class=\"container page_map\">\
    <section class=\"about\">\
      <h1>雜覽圖</h1>\
      <h3>看著雜，也就雜著看吧！</h3>\
      <attenditem v-if='nowviewing' :item='nowviewing' class='now_v_at'/>  \
      <map_panel :svgdata='svgdata' :atlist='atlist' :nowviewing='nowviewing'/>\
    </section>\
  </div>\
  <div v-show=\"nowpage=='attend'\" class=\"container page_attend\">\
    <section class=\"list\">\
      <h1>參展單位</h1>\
      <h3>160種創新教育的單位，輸入你最有興趣的關鍵字，找到屬於你的雜學可能性！</h3>\
      <div class=container> \
      <attendpanel :atlist=atlist :keywords=keywords :wsize=wsize :scroll_top=scroll_top>  \
                  </div>\
    </section>\
  </div>\
  <div v-show=\"nowpage=='activity'\" class=\"page_activity\">\
    <section class=\"talk\"></section>\
    <section class=\"assemblyhall\"></section>\
    <section class=\"workshop\"></section>\
    <section class=\"hall\"></section>\
  </div>\
  </div></div>",
  mounted: function(){
    var vueobj=this;
    $.ajax({
      url: "http://zashare.org/api/command.php?type=get&name=attendlist",
      success: function(res){
        vueobj.atlist=JSON.parse(res);
      }
    })
  },
  methods:{
    findname: function(key){
      for(var i=0;i<this.atlist.length;i++){
        if (this.atlist[i].tag==key){
          return this.atlist[i];
        }
      }
      return null;
    },sw_page: function(tar){
      this.nowpage=tar;
    }
                 
  }
});

$(window).scroll(function(e){
  vm.scroll_top=$(window).scrollTop();
  if ($(window).scrollTop()>350){
    $("#search_headpart_space").css("height",$("#search_headpart").outerHeight()+"px");
  }else{
    $("#search_headpart_space").css("height","");
  }
});

$(window).resize(function(){
  vm.wsize= $(window).width();
});

$(window).mousemove(function(e){
  $(".now_v_at").css("left",e.pageX +"px");
  $(".now_v_at").css("top",e.pageY+"px");
});