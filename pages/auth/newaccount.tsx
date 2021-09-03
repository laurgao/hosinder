import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import useSWR, { SWRResponse } from "swr";
import HandwrittenButton from "../../components/HandwrittenButton";
import SEO from "../../components/SEO";
import { UserModel } from "../../models/User";
import dbConnect from "../../utils/dbConnect";
import fetcher from "../../utils/fetcher";
import { DatedObj, SchoolObj } from "../../utils/types";

//  TODO: set labels and set previous events on change.

export default function NewAccount({ }: {}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [grade, setGrade] = useState<number>(0);
    const [school, setSchool] = useState<string>("");
    const [labels, setLabels] = useState<string[]>([]);
    const [prevEvents, setPrevEvents] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    const {data: schoolData, error: schoolError}: SWRResponse<{data: DatedObj<SchoolObj>[]}, any> = useSWR(`/api/school`, fetcher);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/auth/account", {
            grade: grade,
            school: school,
            labels: labels,
            previousEvents: prevEvents,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                setIsLoading(false);
            } else {
                console.log("redirecting...");
                signIn("google").then(() => router.push("/app")).catch(e => console.log(e));
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }

    return (
        <>
            <SEO title="New account" />
            <h1 className="raleway text-4xl underline text-center p-2">Tell us about yourself</h1>
            {loading ? (
                <Skeleton count={2} />
            ) : (
                <div className="flex justify-center p-4 oswald font-bold">
                    <img
                        src={session.user.image}
                        alt={`Profile picture of ${session.user.name}`}
                        className="rounded-full h-14 w-14 mr-4"
                    />
                    <div>
                        <p className="text-xl">{session.user.name}</p>
                        <p className="text-xl">{session.user.email}</p>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-center p-4 oswald font-bold text-xl">
                <h2>Grade:</h2>
                <div>
                    <div onChange={e => {
                        setGrade(e.target.value);
                        setError(null);
                    }} className="float-left pl-4 pr-4">
                        {[9, 10, 11, 12].map(g => (
                        <>
                        <input type="radio" id={g.toString()} name="grade" value={g} style={{display: "none",}}/>
                        <label 
                            htmlFor={g.toString()} 
                            className={`w-6 h-6 rounded-full cursor-pointer transition px-2 mx-4 ${g == grade && "bg-primary"}`}
                        >{g}</label>
                        </>
                    ))}
                    </div>
                    <p className="float-right">{grade}</p>
                </div>
            </div>
            <h2 className="flex justify-center items-center p-4 oswald font-bold text-xl">School:</h2>
            <div className="flex items-center">

                <Select 
                    options={schoolData && schoolData.data && schoolData.data.map(s => ({
                        value: s._id,
                        label: s.name,
                    }))}
                    onChange={option => setSchool(option.value)}
                    isDisabled={isLoading}
                    className="w-full"
                />
                <p>Don't see your school? Tell your execs to create a school.<br/>Or, continue without one.</p>
            </div>
            <div className="flex justify-center items-center p-4 oswald font-bold text-xl">
                <label>Previous HOSA events:</label>
                <select name="hosaEvents" id="hosaEvents" multiple>
                    <option value="none">-</option>
                    <option value="behavHealth">Behavioral Health</option>
                    <option value="dentTerm">Dental Terminology</option>
                    <option value="humanGrDev">Human Growth and Development </option>
                    <option value="medLawEth">Medical Law and Ethics</option>
                    <option value="medMath">Medical Math</option>
                    <option value="medSpell">Medical Spelling</option>
                    <option value="medTerm">Medical Terminology</option>
                    <option value="nutr">Nutrition</option>
                    <option value="pathophy">Pathophysiology</option>
                    <option value="researPersSpeak">Researched Persuasive Speaking</option>
                    <option value="CERT">CERT Skills</option>
                    <option value="CPR">CPR / First Aid</option>
                    <option value="EMT">Emergency Medical Technician</option>
                    <option value="epidemi">Epidemiology</option>
                    <option value="pubHealth">Public Health</option>
                    <option value="biomedLabSci">Biomedical Laboratory Science</option>
                    <option value="clinNurs">Clinical Nursing</option>
                    <option value="clinSpec">Clinical Specialty</option>
                    <option value="dentSci">Dental Science</option>
                    <option value="pharmSci">Pharmacy Science</option>
                    <option value="physThera">Physical Therapy</option>
                    <option value="sportsMed">Sports Medicine</option>
                    <option value="vetSci">Veterinary Science</option>
                    <option value="biomedDebate">Biomedical Debate</option>
                    <option value="commAware">Community Awareness</option>
                    <option value="creativeProbSol">Creative Problem Solving</option>
                    <option value="forenSci">Forensic Science</option>
                    <option value="HOSABowl">HOSA Bowl</option>
                    <option value="medInno">Medical Innovation</option>
                </select>
            </div>

            <div className="flex justify-center items-center p-4 oswald font-bold text-xl">
                <label>Do you prefer team events or individual events (optional):</label>
                <select name="teamOrIndiv" id="teamOrIndiv">
                    <option value="none">-</option>
                    <option value="team">Team Events</option>
                    <option value="indiv">Individual Events</option>
                </select>
            </div>

                <div className="flex justify-center items-center p-4 oswald font-bold text-xl">
                    <label>Do you prefer knowledge tests or skill performances (optional):</label>
                    <select name="KTorSkillPerf" id="KTorSkillPerf">
                        <option value="none">-</option>
                        <option value="KT">Knowledge Tests</option>
                        <option value="skill">Skill Performances</option>
                    </select>
                </div>

                {error && (
                <p className="text-red-500">{error}</p>
            )}
            <div className="flex justify-center items-center p-4 oswald font-bold text-xl">
            <HandwrittenButton
                // isLoading={isLoading}
                onClick={onSubmit}
                disabled={loading || grade === 0 }
            >
                SUBMIT
            </HandwrittenButton>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

            if (!session) return {redirect: {permanent: false, destination: "/auth/welcome"}};

            try {
        await dbConnect();
        const thisUser = await UserModel.findOne({email: session.user.email});
            return thisUser ? {redirect: {permanent: false, destination: "/app"}} : {props: { }};
    } catch (e) {
                console.log(e);
            return {props: { }};
    }
};