const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);
const heading= $('header h2');
const cdThumb= $('.cd-thumb');
const audio=$('#audio');
const cd=$('.cd');
const playBtn= $('.btn-toggle-play');
const player=$('.player');
const input= $('#progress');
const nextBtn= $('.btn-next');
const prevBtn= $('.btn-prev');
const randomBtn= $('.btn-random');
const repeatBtn= $('.btn-repeat');
const playlist= $('.playlist');



const app={
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs:[
        {
            name:'Le Nhat Phong',
            singer:'Sau Tuong Tu',
            path:'./music/Sau-Tuong-Tu-Nhat-Phong.mp3',
            image:'./image/sautuongtu.jpg'
        },
        {
        name:'Nal',
        singer:'Roi toi luon',
        path:'./music/Roi-Toi-Luon-Nal.mp3',
        image:'./image/roitoiluontop.jpg'
        },
        {
            name:'Le Bao Binh',
            singer:'Sai Cach Yeu',
            path:'./music/Sai-Cach-Yeu-Le-Bao-Binh.mp3',
            image:'./image/saicachyeu.jpg'
        },
      
        {
            name:'Jang Mi',
            singer:'Danh Phan',
            path:'./music/DanhPhan-JangMi-7040679.mp3',
            image:'./image/danhphan.jpg'
        },
        {
            name:'Phuc Chinh',
            singer:'The Luong',
            path:'./music/TheLuong-PhucChinh-6971140.mp3',
            image:'./image/theluong.jpg'
        },
        
    ],
    render: function() {
        const htmls=this.songs.map((song, index) => {
            return  `
                <div class="song ${index===this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
            
            
        })
        playlist.innerHTML=htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
           
        })
    },
    handleEvents: function() {
        const cdWidth=cd.offsetWidth;
        const _this = this
        //xu ly CD quay va dung
        const cdThumbAnimate = cdThumb.animate({transform: 'rotate(360deg)'},{
            duration:10000,//10 seconds
            iterations: Infinity//so lan quay la vo han lan
        })
        cdThumbAnimate.pause();
        //Xử ly phóng to thu nho cd
        document.onscroll= function() {
            const scrollTop=(window.scrollY || document.documentElement.scrollTop);
            const newCdWidth=cdWidth-scrollTop
            cd.style.width=newCdWidth > 0 ? newCdWidth +"px": 0;
            cd.style.opacity=newCdWidth/ cdWidth
        }
        //Xử lý khi click play
        playBtn.onclick=function(){
        if(_this.isPlaying)
            {  
                audio.pause();   
            }else{
                audio.play();
            }
        }
        // khi song được play
        audio.onplay=function(){
            _this.isPlaying=true;
            player.classList.add('playing');
            cdThumbAnimate.play();//quay

        }
        audio.onpause=function(){
            _this.isPlaying=false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()//khong quay
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){

           if(audio.duration)// ktr co phai NAN
           {
                const progressPersent =Math.floor(audio.currentTime / audio.duration *100);
                input.value = progressPersent;

            }         

        }
        // xu ly khi tua
        //e.target.value gia tri hien tai
        input.onchange=function(e) {
            const seekTime=((e.target.value)*(audio.duration))/100;
            audio.currentTime=seekTime;
        }
        //khi next song 
        nextBtn.onclick=function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
                
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
      
        }
        //khi prev song 
        prevBtn.onclick=function() {
            if(_this.isRandom){
                _this.playRandomSong();
            
            }else{
                _this.prevSong();
               
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();


        }
        // khi xu ly bat tat random
         randomBtn.onclick=function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active');
        }
        // xu ly khi ket thuc
        audio.onended =function() {
            //laap lai
            if(_this.isRepeat){
                audio.play();
            }
            //nextBtn.click(); cach hai qua bai
            if(_this.isRandom){
                _this.playRandomSong();
            
            }else{
                _this.nextSong()
               
            }
            audio.play();
        }
        // xy ly lap lai bai hat 
        repeatBtn.onclick=function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active');
        }
        //lang nghe hanh vi click vao playlist
        playlist.onclick=function(e){//e o day la su kien ma no dc nhan
                // cy ly su kien khi click vao
                const songNode=e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                   _this.currentIndex=Number(songNode.dataset.index);
                   _this.loadCurrentSong()
                   _this.render()
                   audio.play()
                }

            }
            if(e.target.closest('.option')){

            }
        }
     
    },
    //cho len dau ne
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView(
                {behavior: "smooth", block: "nearest"}
            );
        },300)
    },
    loadCurrentSong: function() {
       
        heading.textContent=this.currentSong.name;
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')` ;
        audio.src=this.currentSong.path;

    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
        

    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex=this.songs.length -1
        }
        this.loadCurrentSong()
        

    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random() * this.songs.length)
        }while ( newIndex === this.currentIndex )
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        //định nghiac cắc thuộc tính cho object
        this.defineProperties();
       
        //lắng nghe xử lý các sự kiên
        this.handleEvents();

         //render danh sách bài hát
         this.render();

         //tải thông tin bài hát dầu tiên vào UI khi chạy ứng dụng
         this.loadCurrentSong();
    }
}
app.start();
