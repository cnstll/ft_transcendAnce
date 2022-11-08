import Navbar from '../section-components/navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import OneBox from '../section-components/one-box';
// import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
// import { RankingData } from './interface';

// function RankingList({ position, image, name, score }: RankingData) {
//   return (
//     <tr className="h-20">
//       {position === 1 ? (
//         <td
//           className="flex justify-center pt-5
//                     text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
//         >
//           🏆
//         </td>
//       ) : (
//         <td className="flex justify-center pt-5 text-lg sm:text-xl md:text-2xl lg:text-3xl">
//           {position}
//         </td>
//       )}
//       <td>
//         <img
//           className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
//           src={image}
//           alt="Rounded avatar"
//         />
//       </td>
//       <td>{name}</td>
//       <td className="flex justify-center">
//         <NumericFormat
//           className="text-lg sm:text-lg md:text-xl lg:text-2xl"
//           value={score}
//           thousandSeparator=" "
//           displayType="text"
//         />
//       </td>
//     </tr>
//   );
// }

function Ranking() {
  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  return (
    <>
      {user.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {user.isSuccess && (
        <div>
          <Background background={BackgroundGeneral}>
            <Navbar
              text={<FontAwesomeIcon icon={faHouse} />}
              avatarImg={user.data.avatarImg}
            />
            <div className="flex justify-center mt-6">
              <OneBox>
                <h2 className="flex justify-center mt-6 text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  RANKING
                </h2>
                <table className="min-w-full border-collapse mt-10">
                  <thead>
                    <tr>
                      <td className="w-10 sm:w-12 md:w-14 lg:w-20"></td>
                      <td className="w-10 sm:w-12 md:w-14 lg:w-20"></td>
                      <td className="w-1/6 sm:w-2/6 md:w-3/6 lg:w-4/6"></td>
                      <td className="flex justify-center text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
                        SCORE
                      </td>
                    </tr>
                  </thead>
                  {/* <tbody>
                {rankingExamples.map((rankingExample) => (
                  <RankingList
                    position={rankingExample.position}
                    image={rankingExample.image}
                    name={rankingExample.name}
                    score={rankingExample.score}
                  />
                ))}
              </tbody> */}
                </table>
              </OneBox>
            </div>
          </Background>
        </div>
      )}
    </>
  );
}

export default Ranking;
