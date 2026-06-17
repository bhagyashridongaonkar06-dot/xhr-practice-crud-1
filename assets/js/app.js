const cl = console.log;

const postForm= document.getElementById('postForm');
const titleControl =document.getElementById('title');
const bodyControl =document.getElementById('body');
const userIdControl= document.getElementById('userId');
const addPostBtn = document.getElementById('addPostBtn');
const updatePostBtn =document.getElementById('updatePostBtn');
const spinner = document.getElementById('spinner');

let base_url= "https://jsonplaceholder.typicode.com"; 
let post_url =`${base_url}/posts`; 

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
        result +=`<div class="col-md-6 mb-4" id="${ele.id}">
                    <div class="card">
                        <div class="card-header">
                            <H3>${ele.title} </H3>                           
                        </div>
                        <div class="card-body">
                           <p> ${ele.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                        </div>
                    </div>
                </div>   `
    })
    postContainer.innerHTML = result ;
}



function fetchPosts(){
    spinner.classList.remove('d-none');

         
    let xhr=  new XMLHttpRequest(); 
         
    xhr.open('GET',post_url,true); 

    xhr.setRequestHeader('Content-type', 'application/json') ;
    xhr.setRequestHeader('Autho','Get token from');


    xhr.send(null); 

    xhr.onload= function (){ 
    //  console.log(xhr.response);
    console.log(xhr.status);
            
        if(xhr.status>=200 &&  xhr.status<=299){ 
        postArr  =JSON.parse(xhr.response) ;
                    
        createCard(postArr); 
        snackbar('data fetched successfully', 'success')  
                
        }else{ 
            console.log('api is failed...!')  
            snackbar('API failed', 'error') 
        }
            
    } 
}

fetchPosts();




function onPostSubmit(eve){ 
    spinner.classList.remove('d-none');

    eve.preventDefault(); 

    let postObj = { 
           title:titleControl.value,
           body:bodyControl.value,
           userId: userIdControl.value        
        }
  
       //API call to save post in Database.... 
       let xhr= new XMLHttpRequest(); 
          
       xhr.open('POST', post_url);
       xhr.setRequestHeader('Content-type', 'application/json') ;
       xhr.setRequestHeader('Autho','Get token from');

       xhr.send(JSON.stringify(postObj)); 

    xhr.onload = function(){ 
        if(xhr.status>=200 && xhr.status<=299){ 
        let resp =JSON.parse(xhr.response); //This will give me id;
        postForm.reset();
        //create new  card on UI..... 
            let col=document.createElement('div');
            col.className = 'col-md-6 mb-4'; 
            col.id = resp.id;
            col.innerHTML  = 
                            `<div class="card">
                                <div class="card-header">
                                    <h3>${postObj.title} </h3>                           
                                </div>
                                <div class="card-body">
                                    <p>${postObj.body}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                  <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                  <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                </div>
                            </div>` 

             let postContainer = document.getElementById('postContainer');
                postContainer.prepend(col); 
                spinner.classList.add('d-none');
                snackbar('Post created successfully!!', 'success') 
                
            
            
            }else{ 
                   snackbar('New card is not created', 'error');
                   spinner.classList.add('d-none');

                }
    } 
        // xhr.onerror = function (){

        // }   

}




function onEdit(ele){ 
    spinner.classList.remove('d-none');
        let editId= ele.closest('.col-md-6').id ;
        localStorage.setItem('EditId', editId);      
        // let editObj = postArr.find(post =>post) 
        let Edit_url = `${base_url}/posts/${editId}`;
        document.querySelectorAll('.btn-outline-danger').forEach(btn=>{
            btn.disabled == true;
        })
  
        let xhr  = new XMLHttpRequest(); 
        xhr.open('GET',Edit_url);

        xhr.setRequestHeader('Content-type', 'application/json') ;
        xhr.setRequestHeader('Autho','Get token from');

        xhr.send(null);
        
        xhr.onload =function (){ 
        if(xhr.status>=200 && xhr.status<=299){
            let EditObj=  JSON.parse(xhr.response)
            console.log(xhr.response);
               
            titleControl.value  = EditObj.title;
            bodyControl.value   = EditObj.body;
            userIdControl.value = EditObj.userId;
               
            addPostBtn.classList.add('d-none'); 
            updatePostBtn.classList.remove('d-none');  
            spinner.classList.add('d-none')

            }else{ 
                snackbar('Unable to patch the data', 'error');
                spinner.classList.add('d-none')

            }
        } 


}

function onUpdate(){ 
spinner.classList.remove('d-none')
  let updateId = localStorage.getItem('EditId');
  let update_Url=`${base_url}/posts/${updateId}` 
  
  let updateObj= { 
    title:titleControl.value,
    body:bodyControl.value,
    userId: userIdControl.value,
    id : updateId
    }


  let xhr= new XMLHttpRequest();
   //API call (PATCH)
   xhr.open('PATCH', update_Url);
   xhr.send(JSON.stringify(updateObj));

   xhr.onload = function (){ 
  
      if(xhr.status>=200 && xhr.status<=299){ 
       let res = xhr.response; 
        let col= document.getElementById(updateId); 
        let h3= col.querySelector('.card-header h3')
            h3.innerText= updateObj.title;
           
        let p= col.querySelector('.card-header p')
            p.innerText= updateObj.body; 
            spinner.classList.add('d-none');  

         console.log(res); 
        snackbar('Data Updated successfully!!', 'success') 

         document.querySelectorAll('.btn-outline-danger').forEach(btn=>{
            btn.disabled == false;
        })
  
        }else{ 
        snackbar('Unable to update data!!', 'error') 
        spinner.classList.add('d-none');   
        }
    }  
}

function onRemove(ele){ 
    spinner.classList.remove('d-none');
    let removeId =  ele.closest('.col-md-6').id ;
    let removeUrl=  `${base_url}/posts/${removeId}`
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to restore or revert the data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) Swal.fire({
            title: "Deleted!",
            text: "Data Deleted successfully!!",
            icon: "success"
        });
    });

    let xhr= new XMLHttpRequest(); 
        xhr.open('DELETE', removeUrl);
        xhr.send(null);
         
        xhr.onload = function(){ 
            if(xhr.status>=200 && xhr.status<=299){ 
               ele.closest('.col-md-6').remove();
               spinner.classList.add('d-none');
            }else{
                snackbar('Not  deleted','error')
                spinner.classList.add('d-none');
            } 
        }
      
} 


postForm.addEventListener('submit', onPostSubmit)
 