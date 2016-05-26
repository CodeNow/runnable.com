window.addEventListener('load', function(){
  var statusPage = new StatusPage.page({page:'ngvk75ydhg3t'});
  var footer = document.getElementsByClassName('footer')[0];
  var statusElement = document.createElement('a');
  var hrElement = document.createElement('hr');
  var statusText;
  var statusColor;

  // set up status element
  statusElement.href = '//status.runnable.com';
  statusElement.classList.add('btn','btn-xs','link','strong','status');
  hrElement.classList.add('hr','status-hr');

  statusPage.components({
    success : function(data) {
      // add status element
      footer.appendChild(hrElement);
      footer.appendChild(statusElement);

      // set text
      switch (data.components[0].status) {
        case 'operational':
          statusText = 'Status: Beary good!';
          statusColor = 'status-green';
          break;
        case 'degraded_performance':
        case 'partial_outage':
          statusText = 'Partial Outage';
          statusColor = 'status-orange';
          break;
        case 'major_outage':
          statusText = 'Major Outage';
          statusColor = 'status-red';
          break;
      }

      statusElement.textContent = statusText;
      statusElement.classList.add(statusColor);
    }
  });
});
