// Vue component for the profile page

var app = new Vue({	
    el: '#login'
 
    , methods: {
		 
        logIn: function(){
          
            
          axios.get('/login/')
          .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.log(error);
              });
      },
      
    
        
    }
    // These methods are mounted before the page loads for the user
   
})