// Vue component for the profile page

var app = new Vue({	
    el: '#user'
    , data: {
      user: []
      
  }
    , methods: {
		 
        getUserInfo: function(){
          
            
          axios.get('/userinfo')
          .then((response) => {
            this.user=response.data;
            console.log(this.user.display_name);
                console.log(response.data);
              })
              .catch((error) => {
                console.log(error);
              });
      },
      
    
        
    },
    mounted(){
    this.getUserInfo();
    }
    // These methods are mounted before the page loads for the user
   
})