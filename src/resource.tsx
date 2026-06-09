export enum AppResource {
  Products = 'http://localhost:8000/api/products',
  Chat = 'http://localhost:8000/api/chat',
}

export enum AppPath {
  PointSetting = 'points/settings',
  PointSettingList = 'points/list',
  MessagesSend = 'messages/send',

  CouponsEdit = 'coupons/edit',

  AdsQrAnalysis = 'analysis',
  AdsQrPublish = 'ads-qr/publish',
}

export const DEFAULT_META_TITLE = 'PromoTalk';
