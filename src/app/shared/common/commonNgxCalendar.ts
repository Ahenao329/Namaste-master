import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';

//API: https://github.com/kekeh/angular-mydatepicker

export const NgxCalendarOptions: IAngularMyDpOptions  = {
  dateFormat: 'dd/mm/yyyy',
  dateRange: false,
  firstDayOfWeek:'su',  
  //today: 'Hoy',
  markCurrentDay: true,
  monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
  dayLabels: { su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mié', th: 'Jue', fr: 'Vie', sa: 'Sáb' },
  minYear: new Date().getFullYear() - 100,
  maxYear: new Date().getFullYear() + 5,
};

/*export const NgxCalendarOptionsNoLimit: INgxMyDpOptions = {
  dateFormat: 'dd/mm/yyyy',
  todayBtnTxt: 'Hoy',
  markCurrentDay: true,
  monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
  dayLabels: { su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab' },
  minYear: new Date().getFullYear() - 100,
  maxYear: new Date().getFullYear() + 60
};*/
