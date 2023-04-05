document.addEventListener('DOMContentLoaded', function() {
   
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Send a GET request to the URL and get mail values
  document.querySelector('form').onsubmit = function() {

      fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
      })
      // Put response into json form
      .then(response => response.json())
      .then(data => {
          // Log data to the console
          console.log(data);
      })
      // Catch any errors and log them to the console
      //  .catch(error => {
      //    console.log('Error:', error);
      //});
      // Prevent default submission

       // Show the mailbox and hide other views
      document.querySelector('#emails-view').style.display = 'block';
      document.querySelector('#compose-view').style.display = 'none';
      
      load_mailbox('sent')

      return false;

  }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><br>
      <div class="row">
          <div class="col-xs-6">
                <div class="row">
                    <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-6">
                        <strong>Email</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div class="col-xs-10">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-2">
                        <strong>Subject</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-6">
                        <strong>Sent Date</strong><br><br>
                    </div>
                </div>
          </div>
      </div>
  `;

  // Sent view
  if (mailbox == 'sent') {
        fetch('/emails/sent')
        .then(response => response.json())
        .then(emails => {
            // Print emails
            console.log(emails);

            // ... do something else with emails ...
        document.querySelector('#emails-view').innerHTML += emails.map(mailSent => 
            `<div class="row border-top" style="padding: 1em 0;">
              <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                        <div class="col-xs-6">
                            ${mailSent.recipients}
                        </div>
                        <div class="col-xs-10">&nbsp;&nbsp;&nbsp;</div>
                        <div class="col-xs-2">
                            ${mailSent.subject}
                        </div>
                        <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                        <div class="col-xs-6">
                            ${mailSent.timestamp}
                        </div>
                    </div>
              </div>
            </div>`
          ).join('<br>')
        });
  }
  // Sent view

  // Inbox view
  if (mailbox == 'inbox') {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        // ... do something else with emails ...
    document.querySelector('#emails-view').innerHTML += emails.map(mailReceived =>
      (mailReceived.read) ?  
        (`<div id="${mailReceived.id}" class="email-row row border-top" style="background-color:#F4F6F7; padding: 1em 0;">
          <div class="col-xs-6">
                <div  class="row">
                    <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-6">
                        ${mailReceived.recipients}
                    </div>
                    <div class="col-xs-10">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-2">
                        ${mailReceived.subject}
                    </div>
                    <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-6">
                        ${mailReceived.timestamp}
                    </div>
                </div>
          </div>
        </div>`) :
        (`<div id="${mailReceived.id}" class="email-row row border-top" style="background-color:#FFFFFF; padding: 1em 0;">
          <div class="col-xs-6">
                <div class="row">
                    <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-6">
                        ${mailReceived.recipients}
                    </div>
                    <div class="col-xs-10">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-2">
                        ${mailReceived.subject}
                    </div>
                    <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                    <div class="col-xs-6">
                        ${mailReceived.timestamp}
                    </div>
                </div>
          </div>
        </div>`)
     ).join('<br>')
    });
  }
  // Inbox view
  // Single email view
  async function emailClick() {
    try {

        let myPromise = new Promise(function(resolve) {

                setTimeout(function() {resolve (

                //    document.querySelector('.email-row').getAttribute('id')

                    document.querySelectorAll('.email-row').forEach(each => {

                        console.log(each.id);

                        each.addEventListener('click', () => {
                            
                            fetch(`/emails/${each.id}`)
                            .then(response => response.json())
                            .then(email => {
                                // ... do something else with email ...
                                document.querySelector('#emails-view').style.display = 'none';
                                document.querySelector('#entire-email-view').style.display = 'block';
                                document.querySelector('#entire-email-view').innerHTML = `
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div class="row">
                                                <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                                                <div class="col-xs-6">
                                                    Subject: ${email.subject}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                                                <div class="col-xs-6">
                                                    Date Sent: ${email.timestamp}
                                                </div>
                                            </div>
                                            <div class="row">   
                                                <div class="col-xs-12">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
                                                <div class="col-xs-6">
                                                    ${email.body}
                                                </div>
                                            </div>
                                        </div>                                                                      
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div class="form-group">
                                            <form id="compose-form">
                                                    <input type="hidden" id="compose-recipients">
                                                    <input type="hidden" id="compose-subject" >
                                                    <input type="submit" class="btn btn-primary" value="Reply"/>
                                            </form>
                                        </div>
                                    </div>
                                </div>    
                            `;

                            })


                        });

                     })
                  
                  );}, 4000);
          });
          
        //   console.log(await myPromise);

        //   for(i in await myPromise) {

        //      let pathID = await myPromise.item(i).id;
        //      console.log(pathID);

        //   }

        //   let pathID = await myPromise;

        //   console.log('This is my path ID: ', pathID);

        // Adds the link to only the first div elements
        //   if (pathID == '') {
        //     console.log('Path not found')
        //   }else{

        //     document.querySelector('.email-row').addEventListener('click', function() {
        //         fetch(`/emails/${pathID}`)
        //         .then(response => response.json())
        //         .then(email => {
        //             // ... do something else with email ...
        //             document.querySelector('#emails-view').style.display = 'none';
        //             document.querySelector('#entire-email-view').style.display = 'block';
        //             document.querySelector('#entire-email-view').innerHTML = `
        //             <div class="row">
        //                 <div class="col-xs-6">
        //                     <div class="row">
        //                             <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
        //                             <div class="col-xs-6">
        //                                 Subject: ${email.subject}
        //                             </div>
        //                         </div>
        //                         <div class="row">
        //                             <div class="col-xs-12">
        //                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //                             </div>
        //                         </div>
        //                         <div class="row">
        //                             <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
        //                             <div class="col-xs-6">
        //                                 Date Sent: ${email.timestamp}
        //                             </div>
        //                         </div>
        //                         <div class="row">   
        //                             <div class="col-xs-12">
        //                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //                             </div>
        //                         </div>
        //                         <div class="row">
        //                             <div class="col-xs-6">&nbsp;&nbsp;&nbsp;</div>
        //                             <div class="col-xs-6">
        //                                 ${email.body}
        //                             </div>
        //                         </div>
        //                     </div>                                                                      
        //                 </div>
        //             </div>
        //             <div class="row">
        //                 <div class="col-xs-6">
        //                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //                 </div>
        //             </div>
        //             <div class="row">
        //                 <div class="col-xs-6">
        //                     <div class="form-group">
        //                         <form id="compose-form">
        //                                 <input type="hidden" id="compose-recipients">
        //                                 <input type="hidden" id="compose-subject" >
        //                                 <input type="submit" class="btn btn-primary" value="Reply"/>
        //                         </form>
        //                     </div>
        //                 </div>
        //             </div>    
        //         `;

        //         })
        //     });
        //   }
    } catch (e) {
        console.log("caught:", e);
    }
  }

  emailClick();
}