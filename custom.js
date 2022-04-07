
function wcElementFound(ele)
{
  if( ele !== null && ele !== 'undefined' && typeof ele === 'object' )
  {
    return true;
  }
  else
  {
    return false;
  }
  return false;
}

function isJsonString(str) 
{
  try 
  {
    let test = JSON.parse(str);
  } 
  catch (e) 
  {
    return false;
  }
  return true;
}

/** Start-1 Change request type like json or custom parameters **/
function wcContentTypeChnage()
{
  let ct = document.querySelectorAll('#contentType input[type=radio]');

  if(typeof ct === 'object' && ct !== null && ct !== 'undefined')
  {
    Array.from(ct).forEach(function(ele)
    {
      ele.addEventListener('change', function(e)
      {
        let j = document.getElementById('jsonRequestParameters');
        let c =document.getElementById('customParameters');
        if(ele.id == 'contentTypeCustom')
        {
          j.style.display = 'none';
          c.style.display = 'flex';
          
        }
        else
        {
          j.style.display = 'flex';
          c.style.display = 'none';
        }
      });
    }) 
  }
}
wcContentTypeChnage();
/** End-1  **/


/** Start-2 Dynamiclly add or remove text boxex for custom parameter **/
function wcAddNewParameter()
{
  let c = 1;

  function addNew()
  {
    let row = document.createElement('div');
    row.className = 'row g-3 align-items-center my-3';
    row.id = 'cPR' + c;
    row.innerHTML = `<div class="col-5">
                          <input type="text" id="parameterkey${c+1}" class="form-control parameter-key" placeholder="Enter parameter ${c+1} key">
                        </div>
                        <div class="col-5">
                          <input type="text" id="parametervalue${c+1}" class="form-control parameter-val" placeholder="Enter parameter ${c+1} value">
                        </div>
                        <div class="col-2">
                          <button class="btn btn-primary addNewParameter" >+</button>
                          <button class="btn btn-primary removeParameter" id="cPRM${c}" data-row-id="cPR${c}" >-</button>
                        </div>`;


    let rows = document.querySelector('#customParameters .col-10');
    if(wcElementFound(rows))
    {
      rows.appendChild(row);
    }
    c++;
  }

  document.addEventListener('click',function(e)
  {
    /** Add **/
    if(e.target && e.target.classList.contains('addNewParameter'))
    {
      addNew();
    }

    /** Remove **/
    if(e.target && e.target.classList.contains('removeParameter'))
    {
      let rID = e.target.getAttribute('data-row-id');
      let r = document.getElementById(rID);
      if(typeof r === 'object' && r !== null && r !== 'undefined')
      {
        r.remove();
      } 
    }
  });
}
wcAddNewParameter();
/** End-2  **/

/** Start-3 submit function **/

function wcValidation()
{
  console.log('* wcValidation *');
  let flag = true;
  let ct =  document.querySelector('input[name="contentType"]:checked').value;

  if( ct != 'json' )
  {
    let rows = document.querySelectorAll('#customParameters .col-10 > .row');
    Array.from(rows).forEach(function(row)
    {
      if(row.querySelector('.parameter-key').value == '')
      {
        flag = false;
        row.querySelector('.parameter-key').classList.add('wc-error');
      }
      else
      {
        row.querySelector('.parameter-key').classList.remove('wc-error');
      }

      if(row.querySelector('.parameter-val').value == '')
      {
        flag = false;
        row.querySelector('.parameter-val').classList.add('wc-error');
      }
      else
      {
        row.querySelector('.parameter-val').classList.remove('wc-error');
      }
    });
  }
  

  let url = document.getElementById('urlField');

  if(url.value == '')
  {
    flag = false;
    url.classList.add('wc-error');
  }
  else
  {
    url.classList.remove('wc-error');
  }

  
  let json = document.getElementById('jsonRequest');
  let jval = json.value.replace(/ /g,'')
  if( ct == 'json' && jval != '' )
  {
    if(isJsonString(json.value))
    {
      json.classList.remove('wc-error');
    }
    else
    {
      flag = false;
      json.classList.add('wc-error');
    }

  }
  
  console.log('* flag *',flag);
  return flag ;
}

function wcSubmit()
{
  let btn = document.getElementById('submit');
  let txtarea = document.getElementById('response');
  
  if(wcElementFound(btn))
  {
    btn.addEventListener('click',()=> 
    {
      if(wcElementFound(txtarea))
      {
        txtarea.innerHTML = 'Please wait...';
      }

      let url = document.getElementById('urlField').value; 
      let requestType = document.querySelector('input[name="requestType"]:checked').value; 
      let contentType = document.querySelector('input[name="contentType"]:checked').value;
      
      let data ; 
      let flag = true;

      if(contentType == 'custom')
      {
        console.log('* contentType - custom *');
        if(wcValidation())
        {
          let obj= {};
          let rows = document.querySelectorAll('#customParameters .col-10 > .row');
          Array.from(rows).forEach(function(row)
          {
            let key = row.querySelector('.parameter-key').value;
            let val = row.querySelector('.parameter-val').value;

            console.log('key ',key);
            console.log('val ',val);
            obj[key] = val;
          });
          data = JSON.stringify(obj);
          console.log(data);
        }
        else
        {
          flag = false;
        }
      }
      else
      {
        console.log('* contentType - json *');
        if(wcValidation())
        {
          let json = document.getElementById('jsonRequest');
          if(wcElementFound(json))
          {
            data = json.value;
          }
        }
        else
        {
          flag = false;
        }
        
      }

      // console.log('requestType ',requestType);
      // console.log('contentType ',contentType);
      // console.log('data ',data);

      if(flag)
      {
        if(requestType == 'get')
        {
          let options = { method: 'GET' }
          fetch(url,options)
          .then(response => response.json())
          .then((data)=> 
          { 
            console.log(data) 
            let res = document.getElementById('response');
            if(wcElementFound(res))
            {
              res.innerHTML = JSON.stringify(data);
            }
          })
          .catch((error)=> { console.log(error)})
        }
        else
        {

          let options = { method: 'POST',
                          body: data,
                          headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                    },
                        }

          fetch(url, options)
          .then((response) => response.json())
          .then((data)=> 
          { 
            let res = document.getElementById('response');
            if(wcElementFound(res))
            {
              res.innerHTML = JSON.stringify(data);
            }
          })
          .catch((error)=> { console.log(error)})
        }
      }
      else
      {
        console.log('* Error found in inputs! *');
      }
      
    })
  }
}
wcSubmit();
/** End-3 **/