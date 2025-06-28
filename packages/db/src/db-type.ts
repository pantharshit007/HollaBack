export interface DesignType {
  showLogo: boolean;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  titleColor: string;
  btnTextColor: string;
  logoUrl?: string;
}

export interface PersonalDetailsType {
  title: string;
  text: string;
  jobTitle: { active: boolean };
  website: { active: boolean };
  company: { active: boolean };
}

export interface welcomeType {
  title: string;
  text: string;
  allowVideo: boolean;
}

export interface ReviewSettingsType {
  minTextLength: number;
  maxTextLength: number;
  maxVideoDuration: number;
}

export interface LocationDataType {
  city?: string;
  country: string;
  countryCode: string;
}
