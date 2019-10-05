//Advanced filter based on "Is it possible to create a Gmail filter that works on headers other than From, To, Subject?"
// https://webapps.stackexchange.com/questions/5719/is-it-possible-to-create-a-gmail-filter-that-works-on-headers-other-than-from-t

function myFunction() {
 // process all recent threads from Slashdot Deals put in eCommerce/Admin by Gmail filter
 var threads = GmailApp.search("in:eCommerce-Admin newer_than:3h");

 var adminlabel = GmailApp.getUserLabelByName("eCommerce/Admin");
 var dealslabel = GmailApp.getUserLabelByName("eCommerce/Promo Deals");

   for (var i = 0; i < threads.length; i++) {
    // get all messages in a given thread
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      processMessage(message, adminlabel, dealslabel);
    }
  }
  // process all threads from Mashable Deals in Inbox
  threads = GmailApp.search("in:Inbox from:mashabledealsnewsletter newer_than:3h");
  processThreads(threads, dealslabel);
  
  // process all threads from Banggood in Inbox
  threads = GmailApp.search("in:Inbox from:newsletter@deals.banggood.com newer_than:3h");
  processThreads(threads, dealslabel);
  
  // process all threads from Drop.com in Inbox
  threads = GmailApp.search("in:Inbox list:massdrop.1.0.sparkpostmail.com newer_than:3h");
  processThreads(threads, dealslabel);
  
 var destlabel = GmailApp.getUserLabelByName("eCommerce/Discover Mag");
  // process all threads from Discover Magazine in Inbox
  threads = GmailApp.search("in:Inbox from:DiscoverMagazine@mail.kalmbachmail.com newer_than:3h");
  processThreads(threads, destlabel);
}

function processThreads(threads, destlabel) {
  // process all messages in search result parameter 'threads'
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      // get the thread this message belongs to
      var thread = message.getThread();
      destlabel.addToThread(thread); // add message to label in parameter 'destlabel'
      thread.moveToArchive();
    }    
  }
}

function processMessage(message, adminlabel, dealslabel) {
  var body = message.getRawContent();
  // only the advert emails from StackCommerce have this in Reply-To header (others are "noreply+app@")
  if ((body.indexOf("noreply+deals@stackcommerce.com") > -1) || (body.indexOf("noreply+shop@stackcommerce.com") > -1)) {
    // do stuff with message (e.g. add label)
    
    // get the thread this message belongs to
    var thread = message.getThread();
    
    dealslabel.addToThread(thread); // add message to Deals label
    adminlabel.removeFromThread(thread); // remove message from Admin label
  }
}
