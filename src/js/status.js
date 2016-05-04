window.addEventListener('load', function(){
  var statusPage = new StatusPage.page({page:'ngvk75ydhg3t'});
  var popover = document.getElementsByClassName('popover')[0];
  var statusElement = document.createElement('a');
  var statusText;
  var statusColor;

  // set up status element
  statusElement.href = '//status.runnable.com';
  statusElement.classList.add('list-item-a','status');

  statusPage.components({
    success : function(data) {
      // add status element
      popover.appendChild(statusElement);

      // set text
      switch (data.components[0].status) {
        case 'operational':
          statusText = 'Status: Gucci';
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
