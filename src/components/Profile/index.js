import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { Button } from '@/utils/reusableComponents';
import PropTypes from 'prop-types';
import React from 'react';
import { ImageBackground, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkEmpty } from '../../utils/commonFunctions';
import EditProfile from './EditProfile';
import { styles } from './styles';

export default class Profile extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showEditProfile: false,
      section: '',
    };
  }

  editProfile = (section) => {
    this.setState({
      showEditProfile: true,
      section,
    });
  };

  closeEditProfileHandler = () => {
    this.setState({
      showEditProfile: false,
      section: '',
    });
  };

  render() {
    const { showEditProfile, section } = this.state;
    const { user } = this.props;
    const { photoURL, displayName, phoneNumber } = !checkEmpty(user) ? user : {};
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    return (
      <ImageBackground source={background} style={styles.profileBG}>
        <SafeAreaView style={styles.profile}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.profileDisplayContainer}>
              <View style={styles.imageContainer}>
                {photoURL ? (
                  <Avatar.Image size={140} source={{ uri: photoURL }} style={styles.profileImage} />
                ) : (
                  <Avatar.Text size={140} label={displayName && displayName.slice(0, 1)} />
                )}
              </View>
              <View style={styles.personalInfoContainer}>
                <View style={styles.personalInfo}>
                  <Icon name="account" size={20} color="#fff" />
                  <Text style={styles.personalInfoText}>{displayName}</Text>
                </View>
                <View style={styles.personalInfo}>
                  <Icon name="phone" size={20} color="#fff" />
                  <Text style={styles.personalInfoText}>{phoneNumber}</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileActions}>
              <Button
                bordered
                caption="Edit Profile"
                onPress={() => this.editProfile('Basic Details')}
              />
            </View>
          </ScrollView>
          {showEditProfile ? (
            <EditProfile
              visible={showEditProfile}
              section={section}
              data={user}
              closeEditProfileHandler={this.closeEditProfileHandler}
            />
          ) : null}
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
