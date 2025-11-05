export type RootStackParamList = {
  Login: undefined;
  PhoneVerification: undefined;
  BusinessDetails: undefined;
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}