#
# Copyright 2019 Scott J. Johnson (http://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# MinorHighLowIndicator
#
# Mark days with the highest high or lowest low in past/future N periods.
declare upper;

input interval = 9;

def isMinorHigh = fold i = -interval to interval+1 with isHigh = 1 do (if getValue(high, i) > high then 0 else isHigh);
def isMinorLow = fold j = -interval to interval+1 with isLow = 1 do (if getValue(low, j) < low then 0 else isLow);

AddChartBubble(isMinorHigh == 1, high, RoundUp(high, 0), Color.LIGHT_GRAY, yes);
AddChartBubble(isMinorLow == 1, low, RoundDown(low, 0), Color.LIGHT_GRAY, no);
