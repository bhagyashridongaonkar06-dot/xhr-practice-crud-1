
let base_url= "https://jsonplaceholder.typicode.com"; 
let post_url =`${base_url}/posts`; 
const postForm= document.getElementById('postForm');
const titleControl =document.getElementById('title');
const bodyControl =document.getElementById('body');
const userIdControl= document.getElementById('userId');
const addPostBtn = document.getElementById('addPostBtn');
const updatePostBtn =document.getElementById('updatePostBtn');
const spinner = document.getElementById('spinner');


let postArr= []




//GET = data get from back-end to front-end; 

function snackbar(msg,icon){ 
    swal.fire({ 
        title:msg,
        icon:icon,
        timer:3000
    })
}



function createCard(arr){ 
    let result = '  '; 

    arr.forEach(ele=>{ 
        result +=`<div class="col-md-4" id="${ele.id}">
                    <div class="card">
                        <div class="card-header">
                            <H3>${ele.title} </H3>                           
                        </div>
                        <div class="card-body">
                            ${ele.body}
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onClick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                            <button onClick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                        </div>
                    </div>
                </div>   `
    })
    postContainer.innerHTML = result ;
}



function fetchPosts(){
         
    let xhr=  new XMLHttpRequest(); 
         
    xhr.open('GET',post_url,true); 

    xhr.send(null); 

    xhr.onload= function (){ 
    //  console.log(xhr.response);
    console.log(xhr.status);
            
        if(xhr.status>=200 &&  xhr.status<=299){ 
        postArr  =JSON.parse(xhr.response) ;
                    
        createCard(postArr);   
                
        }else{ 
            console.log('api is failed...!')   
        }
            
    } 
}

fetchPosts();




function onPostSubmit(eve){ 
    eve.preventDefault(); 

    let postObj = { 
           title:titleControl.value ,
           body:bodyControl.value,
           userId: userIdControl.value        
        }
  
       //API call to save post in Database.... 
       let xhr= new XMLHttpRequest() ; 
          
       xhr.open('POST', post_url);
       xhr.send(JSON.stringify(postObj)); 

    xhr.onload = function(){ 
        if(xhr.status>=200 && xhr.status<=299){ 
        let resp =JSON.parse(xhr.response); //This will give me id;
        postForm.reset();
        //create new  card on UI..... 
            let col=document.createElement('div');
            col.className = 'col-md-4 mb-3'; 
            col.id = resp.id;
            col.innerHTML  = 
                            `<div class="card">
                                <div class="card-header">
                                    <h3>${postObj.title} </h3>                           
                                </div>
                                <div class="card-body">
                                    ${postObj.body}
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                  <button onClick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                  <button onClick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                </div>
                            </div>` 

             let postContainer = document.getElementById('postContainer');
                postContainer.prepend(col);        
            
            
            }else{ 
                   snackbar('New post is not created', 'error');   
                }
    } 
        // xhr.onerror = function (){

        // }   

}




function onEdit(ele){ 
    //spinner.classList.remove('d-none');
        let editId= ele.closest('.col-md-4').id ;
        localStorage.setItem('EditId', editId);      
        // let editObj = postArr.find(post =>post) 
        let Edit_url = `${base_url}/posts/${editId}`;
  
        let xhr  = new XMLHttpRequest(); 
        xhr.open('GET',Edit_url);

        xhr.setRequestHeader('content-type', 'application/json') ;
        xhr.setRequestHeader('Autho','Get token from');

        xhr.send(null);
        
        xhr.onload =function (){ 
        if(xhr.status>=200 && xhr.status<=299){
            let EditObj=  JSON.parse(xhr.response)
            console.log(xhr.response);
               
            titleControl.value  = EditObj.title ;
            bodyControl.value   = EditObj.body ;
            userIdControl.value = EditObj.userId ;
               
            addPostBtn.classList.add('d-none'); 
            updatePostBtn.classList.remove('d-none');  
            spinner.classList.add('d-none')
            }else{ 
                snackbar('Data in not patched', 'error');
                spinner.classList.add('d-none')

            }
        } 


}

function onUpdate(){ 
    //spinner.classList.remove('d-none')
  let updateId = localStorage.getItem('EditId');
  let update_Url=`${base_url}/posts/${updateId}` 
  
  let updateObj= { 
    title:titleControl.value ,
    body:bodyControl.value ,
    userId:updateId
    }


  let xhr= new XMLHttpRequest() ;
   //API call (PATCH)
   xhr.open('PATCH', update_Url);
   xhr.send(JSON.stringify(updateObj));

   xhr.onload = function (){ 
  
      if(xhr.status>=200 && xhr.status<=200){ 
       let res = xhr.response; 
        let col= document.getElementById(updateId); 
        let h3= col.querySelector('.card-header h3')
            h3.innerText= updateObj.title;
           
        let p= col.querySelector('.card-header p')
            p.innerText= updateObj.body;   

         console.log(res); 
        }else{  
        spinner.classList.add('d-none');   
        }
    }  
}

function onRemove(ele){ 
    let removeId =  ele.closest('.col-md-4').id ;
    let removeUrl=  `${base_url}/posts/${removeId}`

    let xhr= new XMLHttpRequest(); 
        xhr.open('DELETE', removeUrl);
        xhr.send(null);
         
        xhr.onload = function(){ 
            if(xhr.status>=200 && xhr.status<=299){ 
               ele.closest('.col-md-4').remove();
            }else{
                snackbar('Not  deleted','error')
            } 
        }
      
} 


postForm.addEventListener('submit', onPostSubmit)
 