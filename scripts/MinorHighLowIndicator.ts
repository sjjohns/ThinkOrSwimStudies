#
# Copyright 2017 Scott J. Johnson (http://scottjjohnson.com)
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

# there has to be a better way to get the high and low. I don't see a way to get future prices using standard functions.
def isMinorHigh;
if (high > high[9] and high > high[8] and high > high[7] and high > high[6] and high > high[5] and high > high[4] and high > high[3] and high > high[2] and high > high[1] and high > high[-1] and high > high[-2] and high > high[-3] and high > high[-4] and high > high[-5] and high > high[-6] and high > high[-7] and high > high[-8] and high > high[-9]) {
    isMinorHigh = 1;
} else {
    isMinorHigh = 0;
}

def isMinorLow;
if (low < low[9] and low < low[8] and low < low[7] and low < low[6] and low < low[5] and low < low[4] and low < low[3] and low < low[2] and low < low[1] and low < low[-1] and low < low[-2] and low < low[-3] and low < low[-4] and low < low[-5] and low < low[-6] and low < low[-7] and low < low[-8] and low < low[-9]) {
    isMinorLow = 1;
} else {
    isMinorLow = 0;
}

AddChartBubble(isMinorHigh == 1, high, high, Color.LIGHT_GRAY, yes);
AddChartBubble(isMinorLow == 1, low, low, Color.LIGHT_GRAY, no);
