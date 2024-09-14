import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import MdcStarFourPointsOutline from "@meronex/icons/mdc/MdcStarFourPointsOutline";
import React, { useState } from "react";
import { CardsHeading, TasksCard } from "../Cards";
import BsGift from "@meronex/icons/bs/BsGift";
import { ErrorComponent } from "../../../../../common";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../../../../../../../services/apis/BE-apis";
import ProfilePanelHeaders from "../ProfilePanelHeaders";
import BiWallet from "@meronex/icons/bi/BiWallet";
import { useUser } from "../../../../../../../hooks/user";
import Coin from "../../assets/svgs/Coin.svg"

const AllTasksNRewardsV2 = () => {
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [openedModal, setOpenedModal] = useState("");
  const { points } = useUser();

  const {
    data: taskData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getTasks"],
    queryFn: getAllTasks,
  });

  const taskList = taskData?.message;

  return (
    <>
      <ProfilePanelHeaders
        prevMenu="profile"
        // panelHeader={`Hi @${username || "username"}`}
        panelHeader={`Tasks and Rewards`}
        panelContent={
          <>
            <div className="flex justify-between">
              <div className=" bg-gray-200 p-2 m-2 rounded-sm">Completed {"6"} </div>
              <div className="flex align-middle bg-gray-200 p-2 m-2 rounded-sm">
                <BiWallet className="mt-1" />
                <div className="mt-0.5 ml-2">{points} </div>
                <img className="ml-1 h-5" src={Coin}/>

              </div>
            </div>

            <Tabs className="overflow-scroll my-2" value={selectedTab}>
              <TabsHeader className="relative top-0 mx-2 mb-4">
                <Tab
                  value="tasks"
                  className="appFont"
                  onClick={() => setSelectedTab("tasks")}
                >
                  <CardsHeading
                    name="Tasks"
                    icon={<MdcStarFourPointsOutline />}
                  />
                </Tab>

                <Tab
                  value="rewards"
                  className="appFont"
                  onClick={() => setSelectedTab("rewards")}
                >
                  <CardsHeading name="Rewards" icon={<BsGift />} />
                </Tab>
              </TabsHeader>

              {isLoading && (
                <div className="flex justify-center m-8"> Loading... </div>
              )}
              {selectedTab === "tasks" && (
                <>
                  {isError && <ErrorComponent error={error} />}
                  {taskList &&
                    taskList?.map(
                      (task) =>
                        // display only the tasks that are not completed
                        !task?.completed && (
                          <div
                            onClick={() => {
                              setOpenedModal(task?.tag);
                            }}
                          >
                            <TasksCard
                              modalName={task?.tag}
                              isCompleted={task?.completed}
                              // CardHead={task?.description.split(/\\n/)[0]}
                              // CardSubHead={task?.description.split(/\\n/)[1]}
                              CardHead={task?.name}
                              CardSubHead={task?.description}
                              NoOfPoints={task?.amount}
                            />
                          </div>
                        )
                    )}
                </>
              )}

              {selectedTab === "rewards" && (
                <>
                  {isError && <ErrorComponent error={error} />}
                  {taskList &&
                    taskList?.map(
                      (task) =>
                        // display only the tasks that are completed
                        task?.completed && (
                          <TasksCard
                            modalName={task?.tag}
                            isCompleted={task?.completed}
                            // onClickFn={}
                            // CardHead={task?.description.split(/\\n/)[0]}
                            // CardSubHead={task?.description.split(/\\n/)[1]}
                            CardHead={task?.name}
                            CardSubHead={task?.description}
                            NoOfPoints={task?.amount}
                          />
                        )
                    )}
                </>
              )}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default AllTasksNRewardsV2;