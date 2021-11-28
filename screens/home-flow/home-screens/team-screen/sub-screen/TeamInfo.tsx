import React, { useEffect, useContext, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button } from "react-native";

import { Avatar, Card, Input } from "react-native-elements";
import { TeamContextType } from "../../../../../context/ContextTypes";
import {
  Context as TeamContext,
  TeamType,
} from "../../../../../context/TeamContext";
import { TeamTabList } from "../TeamFlowList";
import { DrawerScreenProps } from "@react-navigation/drawer";
import axios from "../../../../../utils/AxiosBase";

type TeamDrawerProps = DrawerScreenProps<TeamTabList, "TeamInfo">;

const getTeamInfo = (pkTeam_Id: string, teamList: TeamType[]) =>
  teamList.filter((team) => team.pkTeam_Id === pkTeam_Id)[0];

const TeamInfo: React.FC<TeamDrawerProps> = ({ route }) => {
  const { state, loadTeamMembers }: TeamContextType = useContext(TeamContext);
  const [teamInfo, setTeamInfo] = useState<TeamType>({
    teamName: "Your Team Name",
    pkTeam_Id: "",
    members: [],
  });
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    loadTeamMembers(route.params);
    setTeamInfo(getTeamInfo(route.params.pkTeam_Id, state.team));
  }, [state.team]);

  const addTeamMembers = async (pkTeam_Id: string, username: string) => {
    try {
      const res = await axios.post("/team/" + pkTeam_Id, {
        username: [username],
      });
      setNewMember("");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <Card.Title style={styles.teamName}>{teamInfo.teamName}</Card.Title>
        <Card.Divider color="black" />
        <Text style={styles.teamDetails}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          distinctio, maiores excepturi doloribus eligendi asperiores aspernatur
          modi expedita molestias laboriosam nostrum ullam ducimus quibusdam!
          Natus ullam voluptatem facilis dicta neque!
        </Text>
        <Text style={styles.addUserTitle}>Add New Member To Team</Text>
        <Input
          placeholder="Add username"
          value={newMember}
          onChangeText={setNewMember}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button
          disabled={newMember.replace(/\s/g, "").length ? false : true}
          title="Add member"
          onPress={() => addTeamMembers(teamInfo.pkTeam_Id, newMember)}
        />
        <Card.Divider color="black" />
        <Card.FeaturedTitle style={styles.subTitle}>Members</Card.FeaturedTitle>
        {teamInfo.members.map((u, i) => {
          return (
            <View key={i} style={styles.memberContainer}>
              <Avatar
                size="medium"
                containerStyle={styles.avatar}
                rounded
                title={u.user.firstName[0]}
                onPress={() => console.log("Works!")}
              />
              <Text style={styles.memberName}>
                {u.user.firstName + " " + u.user.lastName} {" - "}
                {u.user.username}
                {u.memberRole === "Admin" ? " (Manager)" : null}
              </Text>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    // paddingTop: 80,
  },
  cardContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  teamName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  teamDetails: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 20,
  },
  subTitle: {
    color: "black",
  },
  addUserTitle: {
    fontSize: 24,
    marginVertical: 10,
    textAlign: "center",
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "black",
    marginBottom: 10,
  },
  memberName: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default TeamInfo;