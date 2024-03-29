// show bitbucket form
function openBitbucketForm() {
  var gitHubForm = document.getElementsByClassName('article-github')[0];
  var gitHubTrigger = document.getElementsByClassName('js-open-github')[0];
  var bitbucketForm = document.getElementsByClassName('article-bitbucket')[0];
  var bitbucketTrigger = document.getElementsByClassName('js-open-bitbucket')[0];

  bitbucketTrigger.classList.add('hide');
  bitbucketForm.classList.remove('out');
  bitbucketForm.classList.add('in');
  gitHubTrigger.classList.remove('hide');
  gitHubForm.classList.remove('in');
  gitHubForm.classList.add('out');
  // mixpanel
  mixpanel.track('Open Bitbucket form');
}

// show github form
function openGitHubForm() {
  var gitHubForm = document.getElementsByClassName('article-github')[0];
  var gitHubTrigger = document.getElementsByClassName('js-open-github')[0];
  var bitbucketForm = document.getElementsByClassName('article-bitbucket')[0];
  var bitbucketTrigger = document.getElementsByClassName('js-open-bitbucket')[0];

  gitHubTrigger.classList.add('hide');
  gitHubForm.classList.remove('out');
  gitHubForm.classList.add('in');
  bitbucketTrigger.classList.remove('hide');
  bitbucketForm.classList.remove('in');
  // mixpanel
  mixpanel.track('Open GitHub form');
}

// set up forms
function setupForm(formName, allowBitbucket) {
  var formEl;
  var formInputs;
  if (formName === 'signup') {
    var gitHubForm = document.getElementsByClassName('article-github')[0];

    if (allowBitbucket) {
      var bitbucketForm = document.getElementsByClassName('article-bitbucket')[0];
      var openBitbucketFormTrigger = document.getElementsByClassName('js-open-bitbucket')[0];
      var openGitHubFormTrigger = document.getElementsByClassName('js-open-github')[0];

      openGitHubFormTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        openGitHubForm();
      });
      openGitHubFormTrigger.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        openGitHubForm();
      });
      openBitbucketFormTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        openBitbucketForm();
      });
      openBitbucketFormTrigger.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        openBitbucketForm();
      });
    }
  }

  formEl = document.getElementsByClassName('js-form');

  for (i = 0; i < formEl.length; i++) {
    formEl[i].addEventListener('change', makeDirty);
    formEl[i].addEventListener('submit', submitForm);
    formInputs = formEl[i].getElementsByTagName('input');

    for (y = 0; y < formInputs.length; y++) {
      if (formInputs[y].type !== 'checkbox') {
        formInputs[y].addEventListener('invalid', formInvalid);
      }
      if (formInputs[y].type === 'checkbox') {
        formInputs[y].addEventListener('change', validateCheckGroup);
      }
    }
  }
}

function markInvalid(e) {
  var thisTarget = e.target;
  var theseInputs;
  var i;

  if (thisTarget.tagName == 'INPUT') {
    thisTarget.classList.add('invalid');
  } else {
    // for change event
    theseInputs = thisTarget.getElementsByTagName('input');
    for (i = 0; i < theseInputs.length; i++) {
      if (!theseInputs[i].validity.valid) {
        theseInputs[i].classList.add('invalid');
      }
    }
  }
  validateCheckGroup(e);
}

function shakeForm(e) {
  var thisForm = e.target;

  // get shake element
  if (!thisForm.classList.contains('shake-me')) {
    while ((thisForm = thisForm.parentNode) && !thisForm.classList.contains('shake-me'));
  }
  thisForm.classList.add('shake');
  thisForm.addEventListener('animationend', function(){
    thisForm.classList.remove('shake');
    thisForm.removeEventListener('animationend', function(){});
  });
}

function makeDirty(e) {
  var thisTarget = e.target;
  var checkGroup;

  // checkbox logic
  if (thisTarget.type === 'checkbox') {
    // get parent
    while ((thisTarget = thisTarget.parentNode) && !thisTarget.classList.contains('checkbox-group'));
    checkGroup = thisTarget
    checkGroup.classList.remove('pristine');
  } else {
    thisTarget.classList.remove('pristine', 'invalid');
  }
}

function validateCheckGroup(e) {
  var thisTarget;
  var checkGroup;
  var theseInputs;
  var itemChecked = false;
  var otherInput;
  var otherListened = false;

  if (e.target.type !== 'checkbox') {
    thisTarget = false;
    checkGroup = document.getElementsByClassName('checkbox-group')[0];
  } else {
    thisTarget = e.target;
    checkGroup = e.target;
    otherInput = thisTarget.parentNode.querySelectorAll('[name="why-other"]')[0];
    while ((checkGroup = checkGroup.parentNode) && !checkGroup.classList.contains('checkbox-group'));
  }

  // get all checkboxes
  if (checkGroup) {
    theseInputs = checkGroup.querySelectorAll('[type="checkbox"]');
  }

  // toggle required state
  if (thisTarget.checked) {
    // if an "other" option
    if (thisTarget.value === 'Other') {
      otherInput.setAttribute('required','required');

      if (!otherListened) {
        otherInput.addEventListener('click',function(e){
          e.preventDefault();
          otherListened = true;
        })
      }
    }
    // remaining options
    for (i = 0; i < theseInputs.length; i++) {
      theseInputs[i].removeAttribute('required');
    }
    checkGroup.classList.remove('invalid');
    itemChecked = true;
  } else if (!thisTarget.checked || !thisTarget) {
    if (thisTarget.value === 'Other') {
      otherInput.removeAttribute('required');
    }

    for (i = 0; i < theseInputs.length; i++) {
      if (theseInputs[i].checked) {
        itemChecked = true;
      }
    }
  }

  if (!itemChecked) {
    for (i = 0; i < theseInputs.length; i++) {
      theseInputs[i].setAttribute('required','required');
    }
    // mark invalid
    checkGroup.classList.add('invalid');
  }
}

function formInvalid(e) {
  markInvalid(e);
  shakeForm(e);
}

function toggleEditing(form, state) {
  var i;
  var theseInputs = form.getElementsByTagName('input');
  var theseTextareas = form.getElementsByTagName('textarea')[0];
  var submitButton = form.getElementsByTagName('button')[0];
  var spinner = document.getElementsByClassName('spinner-wrapper');

  if (state === 'disable') {
    if (theseInputs) {
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].disabled = true;
      }
    }
    if (theseTextareas) {
      theseTextareas.disabled = true;
    }
    submitButton.disabled = true;
    if (submitButton.classList.contains('green')) {
      submitButton.children[0].innerHTML += '<div class="grid-content shrink spinner-wrapper spinner-sm spinner-white"><svg viewbox="0 0 16 16" class="spinner"><circle cx="8" cy="8" r="7" stroke-linecap="round" class="path"></circle></svg></div>';
    } else {
      submitButton.children[0].innerHTML += '<div class="grid-content shrink spinner-wrapper spinner-sm spinner-gray"><svg viewbox="0 0 16 16" class="spinner"><circle cx="8" cy="8" r="7" stroke-linecap="round" class="path"></circle></svg></div>';
    }
  }
  if (state === 'enable') {
    if (theseInputs) {
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].disabled = false;
      }
    }
    if (theseTextareas) {
      theseTextareas.disabled = false;
    }
    submitButton.disabled = false;
    spinner[0].parentNode.removeChild(spinner[0]);
  }
}

function xhrSubmit(e, form, formData, formName) {
  var xhr = new XMLHttpRequest();
  var xhrUrl;
  var supportEmail;

  if (formName === 'github') {
    xhrUrl = 'https://codenow.com:2087/sign_up';
    supportEmail = 'support@runnable.com';
  } else if (formName === 'bitbucket') {
    xhrUrl = 'https://codenow.com:8443/bitbucket';
    supportEmail = 'bitbucket@runnable.com';
  }

  // fires when payload sent successfully
  xhr.addEventListener('load', function(evt) {
    var response = JSON.parse(xhr.responseText);
    var resultCode = response.result_code;
    var resultMessage = response.result_message;
    var successMsg = form.parentNode.getElementsByClassName('hide')[0];
    var href;

    // result_codes:
    // -1 = error from sundip
    // 0 = error from active campaign
    // 1 = success from active campaign
    if (resultCode === -1 || resultCode === 0) {
      shakeForm(e);
      sundipValidation(resultMessage, form, formName);
      // mixpanel
      mixpanel.track('XHR Submit: ' + formName, {
        'server-side validation': 'fail',
        'error': (resultCode === -1 ? 'From Sundip’s script' : 'From Active Campaign')
      });
    }

    if (resultCode === 1) {
      // mixpanel
      mixpanel.track('XHR Submit: ' + formName, {
        'server-side validation': 'pass'
      });

      // tell the user something nice
      form.classList.add('hide');
      form.classList.remove('show');
      successMsg.classList.add('show');
      successMsg.classList.remove('hide');

      // if github form, redirect to log in
      if (formName === 'github') {
        href = form.querySelectorAll('[data-href]')[0].getAttribute('data-href');
        setTimeout(function(){window.location.href = href;},2500);
      }
    }
    toggleEditing(form, 'enable'); // re-enables form
  });

  // fires when error occured while sending payload
  xhr.addEventListener('error', function(evt) {
    shakeForm(e);
    sundipValidation('An error occured ('+xhr.status+'). Send us an email at <a class="link" href="mailto:' + supportEmail + '">' + supportEmail + '</a> for help.', form, formName);
    toggleEditing(form, 'enable'); // re-enables form

    // segment
    analytics.track('Error', {
      form: formName,
      xhrStatusCode: xhr.status,
      xhrStatusText: xhr.statusText,
      email: formData.email
    });
    // mixpanel
    mixpanel.track('XHR Submit: ' + formName, {
      'server-side validation': 'fail',
      'error': 'xhr.readyState === 4 && xhr.status === 0'
    });
  });

  // fires when user stops request while being submitted
  xhr.addEventListener('abort', function(evt) {
    toggleEditing(form, 'enable'); // re-enables form

    // segment
    analytics.track('Abort', {
      form: formName,
      xhrStatusCode: xhr.status,
      xhrStatusText: xhr.statusText,
      email: formData.email
    });
  });

  // send form
  xhr.open('POST', xhrUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(formData);
}

function submitForm(e) {
  var form = e.target;
  var formName;
  var segment_id;
  var client_id;
  var intent;
  var woopraCookie;

  try {
    // Get anonymousId
    segment_id = analytics.user().anonymousId();
    client_id = ga.getAll()[0].get('clientId');

    // Get Woopra's cookie to bind session on the server-side
    woopraCookie = window.woopra.cookie;
  } catch (err) {
    // pass through with errors
    console.log('Error obtaining IDs: '+ err);
  }

  if (form.classList.contains('form-github')) {
    formName = 'github';
  } else if (form.classList.contains('form-bitbucket')) {
    formName = 'bitbucket';
  }

  e.preventDefault();

  if (form.checkValidity()) {
    var emailValue = form.querySelectorAll('[name="email"]')[0].value;
    var nameValue = form.querySelectorAll('[name="name"]')[0].value;
    var formData = {};
    var name = 'name';

    // special github form data
    if (formName === 'github') {
      var whyInputs = form.querySelectorAll('[name="checkbox-why"]');
      var whyValue = [];
      var otherValue;
      var whySegment = [];

      // change name to be labelled company
      name = 'company';

      for (i = 0; i < whyInputs.length; i++) {
        var obj = {
          name: whyInputs[i].value,
          checkbox: whyInputs[i].checked
        }

        if (whyInputs[i].value === 'Other') {
          obj.otherValue = form.querySelectorAll('[name="why-other"]')[0].value;
        }

        // for segment, we only want to send the data if it's checked
        if (whyInputs[i].checked) {
          if (whyInputs[i].value === 'Other') {
            whySegment.push('Other: ', form.querySelectorAll('[name="why-other"]')[0].value, '; ');
          } else {
            whySegment.push(whyInputs[i].value, '; ');
          }
        }

        whyValue.push(obj);
      }
      intent = whySegment.join('').trim();
    }

    toggleEditing(form, 'disable'); // disables inputs

    // jsonify form data
    formData.email = emailValue;
    formData.why = whyValue;
    formData.intent = intent;
    formData.id = segment_id;
    formData.client_id = client_id;
    formData.woopraCookie = woopraCookie;
    formData.planType = 'self-hosted';

    // add name
    formData[name] = nameValue;
    xhrSubmit(e, form, JSON.stringify(formData), formName);

    // segment
    delete formData['why'];
    analytics.ready(function() {
      var segmentTraits = {
        email: emailValue,
        Intent: intent
      };
      segmentTraits[name] = nameValue;

      analytics.identify({
        anonymousId: segment_id,
        traits: segmentTraits,
        integrations: {
          Intercom: false,
          Woopra: {
            cookie: woopraCookie
          }
        }
      });
      analytics.track(formName + ' sign up', formData);
    });

    // mixpanel
    mixpanel.track('FE Submit: ' + formName, {
      'front-end validation': 'pass'
    });
  }
}

function sundipValidation(resultMessage, form, formName) {
  var prevError = form.getElementsByClassName('js-error')[0];
  var error;
  var submitButton;

  if (prevError) {
    prevError.parentNode.removeChild(prevError);
  }

  if (formName === 'github' || formName === 'bitbucket') {
    error = document.createElement('div');
    error.classList.add('well', 'well-red', 'text-center', 'small','padding-xxs','margin-top-md','js-error');
    error.innerHTML = resultMessage;
    form.children[0].appendChild(error);
  } else {
    submitButton = form.getElementsByTagName('button')[0];
    error = document.createElement('small');
    error.classList.add('popover', 'bottom', 'in', 'small','red','text-center');
    error.innerHTML = resultMessage;
    submitButton.appendChild(error);
  }

  analytics.ready(function() {
    analytics.track('Error ' + formName + '-list form', {error: resultMessage, clientId: ga.getAll()[0].get('clientId')});
  });
}

// events
window.addEventListener('DOMContentLoaded', function(){
  var allowBitbucket;
  var formType;

  // if github form exists
  if (document.getElementsByClassName('form-github').length > 0) {
    formType = 'signup';
  }
  // setup if form found
  if (formType) {
    allowBitbucket = true;
    setupForm(formType, allowBitbucket);
  }
});
