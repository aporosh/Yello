import React from "react";
import { useSelector } from "react-redux";
import { useGetChallengersQuery } from "../../store/api/apiSlice";


const ResultPage = () => {
    const { data, isLoading, isSuccess, isFetching, isError, error } = useGetChallengersQuery();

    //if (results.length === 0) return <p className="text-center">No items</p>

    if (isFetching) return <p>Loading</p>;
    if (error) return  <p>Error: {error.toString()} </p>;
    console.log(data)
    return (
        <>
            {isSuccess && (
                <div>
                    {data.length == 0 && <div>Нет результатов</div>}
                    <ul >
                        {data?.map((post) => {
                            return <li key={post.id}>
                               <div>{post.title}</div>
                            </li>
                        }

                        )}
                    </ul>
                </div>


            )}
        </>
    )
}

export default ResultPage;
/**
 * <ul className="list-none">
                {favourites.map(f => (
                    <li key={f}>
                        <a href={f} target="_blank">{f}</a>
                    </li>
                ))}
            </ul>



            <div className="flex justify-center pt-10 mx-auto h-screen w-screen">
            <h3>Game results</h3>
        </div>
 */
/**
 * <>
            {isLoading ? (
                <div >Loading...</div>
            ) : !isSuccess || !data.length ? (
                <div >
                    <span>Нет результатов</span>
                </div>
            ) : (
                <ul >
                    {data.map(f => (
                        <li key={f}>
                            <a href={f} target="_blank">{f}</a>
                        </li>
                    ))}
                </ul>

            )}
        </>
 */